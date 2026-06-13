import express from "express";
import { createCommunityPost, getCommunityPosts } from "../Controllers/communityController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, getCommunityPosts);
router.post("/", verifyUser, createCommunityPost);

export default router;
