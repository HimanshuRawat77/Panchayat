import express from "express";
import {
  createComplaint,
  getMyComplaints,
  updateComplaintStatus,
} from "../Controllers/complaintController.js";
import { verifyUser, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", verifyUser, createComplaint);
router.get("/my", verifyUser, getMyComplaints);
router.put("/update/:id", verifyUser, isAdmin, updateComplaintStatus);

export default router;