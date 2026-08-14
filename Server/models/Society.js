import mongoose from "mongoose";
import crypto from "crypto";

const societySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    state: {
      type: String,
      trim: true,
      default: "",
    },
    pincode: {
      type: String,
      trim: true,
      default: "",
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    contactPhone: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => crypto.randomBytes(4).toString("hex").toUpperCase(),
    },

    // Society-level info (merged from SocietyInfo)
    officeLocation: { type: String, default: "" },
    officeTiming: { type: String, default: "" },
    emergencyNumber: { type: String, default: "" },
    gymLocation: { type: String, default: "" },
    gymTiming: { type: String, default: "" },
    clubhouseLocation: { type: String, default: "" },
    clubhouseTiming: { type: String, default: "" },
    securityDesk: { type: String, default: "" },
  },
  { timestamps: true }
);

societySchema.index({ inviteCode: 1 });
societySchema.index({ status: 1 });

const Society = mongoose.model("Society", societySchema);

export default Society;
