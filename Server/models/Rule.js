import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    keywords: [{
      type: String,
      trim: true
    }],
    isPinned: {
      type: Boolean,
      default: false,
    },
    effectiveDate: {
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

ruleSchema.index({ societyId: 1 });
ruleSchema.index({ societyId: 1, createdAt: -1 });

ruleSchema.post('save', async function(doc) {
  await syncDocumentToVectorDB(doc, 'rule');
});

ruleSchema.post('findOneAndUpdate', async function(doc) {
  if (doc) await syncDocumentToVectorDB(doc, 'rule');
});

ruleSchema.post('findOneAndDelete', async function(doc) {
  if (doc) await deleteDocumentFromVectorDB(doc._id, 'rule');
});

export default mongoose.model("Rule", ruleSchema);