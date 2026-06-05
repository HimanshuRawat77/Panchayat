import mongoose from "mongoose";

const societyInfoSchema = new mongoose.Schema(
  {
    societyName: { type: String, required: true },
    address: { type: String, required: true },
    officeLocation: { type: String, required: true },
    officeTiming: { type: String, required: true },
    emergencyNumber: { type: String, required: true },
    gymLocation: { type: String },
    clubhouseLocation: { type: String },
    securityDesk: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("SocietyInfo", societyInfoSchema);
