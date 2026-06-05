import express from "express";
import { getNotifications, markAsRead, markAllAsRead } from "../Controllers/notificationController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, getNotifications);
router.put("/:id/read", verifyUser, markAsRead);
router.put("/read-all", verifyUser, markAllAsRead);

export default router;
