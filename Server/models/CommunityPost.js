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
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    }
  },
  { timestamps: true },
);

import { syncDocumentToVectorDB, deleteDocumentFromVectorDB } from '../services/vectorSyncService.js';

communityPostSchema.index({ societyId: 1 });
communityPostSchema.index({ societyId: 1, createdAt: -1 });
communityPostSchema.index({ category: 1 });
communityPostSchema.index({ societyId: 1, category: 1 });

communityPostSchema.post('save', async function(doc) {
  await syncDocumentToVectorDB(doc, 'community_post');
});

communityPostSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) await syncDocumentToVectorDB(doc, 'community_post');
});

communityPostSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await deleteDocumentFromVectorDB(doc._id, 'community_post');
});

export default mongoose.model("CommunityPost", communityPostSchema);
