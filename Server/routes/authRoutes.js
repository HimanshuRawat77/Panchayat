import express from 'express';
import { signup, login, getMe, updateProfile, getAllUsers } from '../Controllers/authController.js';
import { verifyUser, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private routes
router.get('/me', verifyUser, getMe);
router.put('/update', verifyUser, updateProfile);

// Admin routes
router.get('/users', verifyUser, isAdmin, getAllUsers);

export default router;