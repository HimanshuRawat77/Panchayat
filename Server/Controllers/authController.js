import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// ✅ SIGNUP
export const signup = async (req, res) => {
  console.log("Signup Request Received:", req.body);
  try {
    const { fullName, phoneNumber, email, password, role, houseNumber, block, nationality, religion } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // phoneNumber check
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // create user
    const user = await User.create({
      fullName,
      phoneNumber,
      email,
      password, // Password will be hashed by pre-save middleware in User model
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

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // create token
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
        houseNumber: user.houseNumber
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error in login', error: error.message });
  }
};