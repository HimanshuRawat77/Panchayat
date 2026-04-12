import express from 'express';
import { signup, login } from '../Controllers/authController.js';

const router = express.Router();

// routes
router.post('/signup', signup);
router.post('/login', login);

export default router;