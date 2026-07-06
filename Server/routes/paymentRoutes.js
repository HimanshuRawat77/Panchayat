import express from "express";
import {
  activateFreeTrial,
  createPaymentOrder,
  getSubscription,
  verifyPayment,
} from "../Controllers/paymentController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/subscription", verifyUser, getSubscription);
router.post("/free-trial", verifyUser, activateFreeTrial);
router.post("/create-order", verifyUser, createPaymentOrder);
router.post("/verify", verifyUser, verifyPayment);

export default router;
