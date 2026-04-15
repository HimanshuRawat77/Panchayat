import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    aiSummary: String,

    category: {
      type: String,
      required: true,
      enum: ["plumber", "electrician", "carpenter", "other"],
    },

    status: {
      type: String,
      enum: ["Pending", "In progress", "Resolved"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    image: {
      type: String, // URL of the uploaded image
    },
  },
  { timestamps: true }
);

export default mongoose.model("Complaint", complaintSchema);