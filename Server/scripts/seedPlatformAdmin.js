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

    const email = 'platform@admin.com';
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️ Platform admin already exists.');
      process.exit(0);
    }

    const platformAdmin = await User.create({
      fullName: 'Super Platform Admin',
      phoneNumber: '9999999999',
      email,
      password: 'platformadmin',
      role: 'platform_admin',
      houseNumber: 'HQ',
      block: 'HQ',
      societyId: null, // Platform admins do not belong to a society
    });

    console.log('✅ Platform Admin created successfully:');
    console.log('Email:', platformAdmin.email);
    console.log('Password: platformadmin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding platform admin:', error);
    process.exit(1);
  }
};

seedPlatformAdmin();
