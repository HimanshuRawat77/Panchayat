import express from 'express';
import { summarizeComplaint, askAssistant } from '../Controllers/aiController.js';
import { verifyUser } from '../middleware/authMiddleware.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Both residents and admins might want to use this, so verifyUser is enough.
router.post('/summarize', verifyUser, summarizeComplaint);
router.post('/ask', verifyUser, aiRateLimiter, askAssistant);

export default router;
