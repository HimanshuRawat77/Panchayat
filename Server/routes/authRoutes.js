import express from 'express';
import { signup, login, getMe, updateProfile } from '../Controllers/authController.js';
import { verifyUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Private routes
router.get('/me', verifyUser, getMe);
router.put('/update', verifyUser, updateProfile);

export default router;