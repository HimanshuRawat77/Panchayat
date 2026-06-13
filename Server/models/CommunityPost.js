import mongoose from "mongoose";

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
    },
    block: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      default: "Suggestion",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("CommunityPost", communityPostSchema);
