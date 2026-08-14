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

ruleSchema.index({ societyId: 1 });
ruleSchema.index({ societyId: 1, createdAt: -1 });

export default mongoose.model("Rule", ruleSchema);