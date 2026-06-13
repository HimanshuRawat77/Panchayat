import CommunityPost from "../models/CommunityPost.js";
import User from "../models/User.js";

export const getCommunityPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(posts);
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
      author: user._id,
      authorName: user.fullName,
      block: user.block,
      avatar: user.avatar || "",
      category: category || "Suggestion",
      content: content.trim(),
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to create community post", error: error.message });
  }
};
