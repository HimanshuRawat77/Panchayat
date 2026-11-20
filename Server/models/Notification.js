import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['RuleAdded', 'RuleUpdated', 'RuleRemoved', 'Other'],
      default: 'Other'
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
  },
  { timestamps: true }
);

notificationSchema.index({ societyId: 1, createdAt: -1 });
notificationSchema.index({ societyId: 1, readBy: 1 });

export default mongoose.model("Notification", notificationSchema);
