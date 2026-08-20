import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: [{
      type: String,
      trim: true
    }],
    date: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
  },
  { timestamps: true }
);

import { syncDocumentToVectorDB, deleteDocumentFromVectorDB } from '../services/vectorSyncService.js';

noticeSchema.index({ societyId: 1 });
noticeSchema.index({ societyId: 1, createdAt: -1 });

noticeSchema.post('save', async function(doc) {
  await syncDocumentToVectorDB(doc, 'notice');
});

noticeSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) await syncDocumentToVectorDB(doc, 'notice');
});

noticeSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await deleteDocumentFromVectorDB(doc._id, 'notice');
});

export default mongoose.model("Notice", noticeSchema);
