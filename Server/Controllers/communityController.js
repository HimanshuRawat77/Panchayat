import CommunityPost from "../models/CommunityPost.js";
import User from "../models/User.js";
import { invalidateCache } from "../services/cacheService.js";

export const getCommunityPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find({ societyId: req.user.societyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await CommunityPost.countDocuments({ societyId: req.user.societyId });

    res.status(200).json({ posts, total });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch community posts", error: error.message });
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const { category, content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await CommunityPost.create({
      author: req.user.id,
      authorName: user.fullName,
      block: user.block,
      avatar: user.avatar || "",
      category: category || "Suggestion",
      content: content.trim(),
      societyId: req.user.societyId,
    });

    await invalidateCache(`society:${req.user.societyId}:posts`);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to create community post", error: error.message });
  }
};
