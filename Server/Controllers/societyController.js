import Society from "../models/Society.js";
import User from "../models/User.js";
import crypto from "crypto";

// Create a new society (Platform Admin only)
export const createSociety = async (req, res) => {
  try {
    const { name, address, city, state, pincode, contactEmail, contactPhone } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and Address are required." });
    }

    const inviteCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    const newSociety = await Society.create({
      name: name.trim(),
      address: address.trim(),
      city: city?.trim() || "",
      state: state?.trim() || "",
      pincode: pincode?.trim() || "",
      contactEmail: contactEmail?.trim() || "",
      contactPhone: contactPhone?.trim() || "",
      inviteCode,
    });

    res.status(201).json({
      message: "Society created successfully",
      society: newSociety,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create society", error: error.message });
  }
};

// Get all societies with resident counts (Platform Admin only)
export const getSocieties = async (req, res) => {
  try {
    const societies = await Society.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "societyId",
          as: "users",
        },
      },
      {
        $addFields: {
          residentCount: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.role", "resident"] },
              },
            },
          },
          adminCount: {
            $size: {
              $filter: {
                input: "$users",
                as: "user",
                cond: { $eq: ["$$user.role", "admin"] },
              },
            },
          },
          admins: {
            $filter: {
              input: "$users",
              as: "user",
              cond: { $eq: ["$$user.role", "admin"] },
            },
          },
        },
      },
      {
        $project: {
          users: 0, // exclude full users array
          "admins.password": 0, // ensure passwords are excluded
        },
      },
    ]);

    res.status(200).json(societies);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch societies", error: error.message });
  }
};

// Create initial admin for a society (Platform Admin only)
export const createSocietyAdmin = async (req, res) => {
  try {
    const { id } = req.params; // societyId
    const { fullName, phoneNumber, email, password, houseNumber, block } = req.body;

    const society = await Society.findById(id);
    if (!society) {
      return res.status(404).json({ message: "Society not found." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered." });
    }

    const admin = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
      role: "admin",
      societyId: society._id,
      houseNumber: houseNumber || "N/A",
      block: block || "N/A",
    });

    res.status(201).json({
      message: "Society admin created successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        societyId: admin.societyId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create society admin", error: error.message });
  }
};
