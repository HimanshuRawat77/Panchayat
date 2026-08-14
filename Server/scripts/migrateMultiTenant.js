import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

import Society from "../models/Society.js";
import SocietyInfo from "../models/SocietyInfo.js";
import User from "../models/User.js";
import Rule from "../models/Rule.js";
import Notice from "../models/Notice.js";
import CommunityPost from "../models/CommunityPost.js";
import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import Worker from "../models/Worker.js";

const migrate = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    console.log("Starting Multi-Tenant Migration...");

    // 1. Create or Find the Default Society
    let defaultSociety = await Society.findOne({ name: "Default Society" });

    if (!defaultSociety) {
      console.log("Creating default society...");
      
      // Attempt to migrate existing SocietyInfo data if it exists
      const existingInfo = await SocietyInfo.findOne();
      
      defaultSociety = await Society.create({
        name: existingInfo?.societyName || "Default Society",
        address: existingInfo?.address || "Default Address",
        officeLocation: existingInfo?.officeLocation || "",
        officeTiming: existingInfo?.officeTiming || "",
        emergencyNumber: existingInfo?.emergencyNumber || "",
        gymLocation: existingInfo?.gymLocation || "",
        gymTiming: existingInfo?.gymTiming || "",
        clubhouseLocation: existingInfo?.clubhouseLocation || "",
        clubhouseTiming: existingInfo?.clubhouseTiming || "",
        securityDesk: existingInfo?.securityDesk || "",
      });
      console.log("✅ Created Default Society with ID:", defaultSociety._id);
    } else {
      console.log("ℹ️ Default Society already exists with ID:", defaultSociety._id);
    }

    const societyId = defaultSociety._id;

    // Helper to migrate a collection
    const migrateCollection = async (Model, modelName) => {
      console.log(`Migrating ${modelName}...`);
      const result = await Model.updateMany(
        { societyId: { $exists: false } },
        { $set: { societyId } }
      );
      console.log(`✅ ${modelName}: Updated ${result.modifiedCount} records.`);
    };

    // 2. Migrate all collections
    await migrateCollection(User, "Users");
    await migrateCollection(Rule, "Rules");
    await migrateCollection(Notice, "Notices");
    await migrateCollection(CommunityPost, "CommunityPosts");
    await migrateCollection(Complaint, "Complaints");
    await migrateCollection(Notification, "Notifications");
    await migrateCollection(Worker, "Workers");

    console.log("🎉 Migration completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrate();
