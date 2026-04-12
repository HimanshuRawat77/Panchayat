import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ✅ SIGNUP
export const signup = async (req, res) => {
  console.log("Signup Request Received:", req.body);
  try {
    const { fullName, phoneNumber, email, password, role, houseNumber, block, nationality, religion } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const user = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
      role,
      houseNumber,
      block,
      nationality,
      religion
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Error in signup', error: error.message });
  }
};


// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        block: user.block,
        houseNumber: user.houseNumber,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error in login', error: error.message });
  }
};

// ✅ GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    // Prevent updating password through this route for security
    const { password, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        block: user.block,
        houseNumber: user.houseNumber,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};