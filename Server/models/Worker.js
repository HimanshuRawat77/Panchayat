import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    trade: {
      type: String,
      required: true,
      enum: ["plumber", "electrician", "carpenter"],
    },
    isActive: { type: Boolean, default: true },
    societyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Society',
    },
  },
  { timestamps: true }
);

workerSchema.index({ societyId: 1, trade: 1, name: 1 });

export default mongoose.model("Worker", workerSchema);
