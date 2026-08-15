import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedPlatformAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const email = process.env.PLATFORM_ADMIN_EMAIL;
    const password = process.env.PLATFORM_ADMIN_PASSWORD;
    const phone = process.env.PLATFORM_ADMIN_PHONE;

    if (!email || !password || !phone) {
      console.error('❌ Error: PLATFORM_ADMIN_EMAIL, PLATFORM_ADMIN_PASSWORD, and PLATFORM_ADMIN_PHONE must be set in environment variables.');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️ Platform admin already exists.');
      process.exit(0);
    }

    const platformAdmin = await User.create({
      fullName: 'Super Platform Admin',
      phoneNumber: phone,
      email,
      password,
      role: 'platform_admin',
      houseNumber: 'HQ',
      block: 'HQ',
      societyId: null, // Platform admins do not belong to a society
    });

    console.log('✅ Platform Admin created successfully:');
    console.log('Email:', platformAdmin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding platform admin:', error);
    process.exit(1);
  }
};

seedPlatformAdmin();
