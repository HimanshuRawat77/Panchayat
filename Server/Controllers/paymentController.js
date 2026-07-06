import crypto from "crypto";
import Razorpay from "razorpay";
import User from "../models/User.js";
import {
  activateUserPlan,
  buildSubscriptionResponse,
  getPlanConfig,
  refreshUserPlanStatus,
} from "../services/planService.js";

const getRazorpayClient = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay test credentials are not configured");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return refreshUserPlanStatus(user);
};

const hasActivePaidPlan = (user) =>
  user.planStatus === "active" &&
  user.planExpiresAt &&
  new Date(user.planExpiresAt).getTime() > Date.now() &&
  user.subscriptionMode !== "Free";

export const activateFreeTrial = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    const plan = getPlanConfig("free");

    if (user.planStatus === "active" && user.subscriptionMode === "Free") {
      return res.status(409).json({ message: "You already have a plan." });
    }

    if (hasActivePaidPlan(user)) {
      return res.status(409).json({ message: "You already have a plan." });
    }

    await activateUserPlan(user, plan);

    res.status(200).json({
      message: "Your free trial has been activated.",
      subscription: buildSubscriptionResponse(user),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Unable to activate free trial",
    });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = getPlanConfig(planId);

    if (!plan || plan.amount <= 0) {
      return res.status(400).json({ message: "Invalid paid plan selected" });
    }

    const user = await getCurrentUser(req.user.id);

    if (hasActivePaidPlan(user)) {
      return res.status(409).json({ message: "You already have a plan." });
    }

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: plan.amount * 100,
      currency: "INR",
      receipt: `plan_${user._id.toString().slice(-8)}_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        planId: plan.id,
        planName: plan.name,
      },
    });

    res.status(201).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan: {
        id: plan.id,
        name: plan.name,
        amount: plan.amount,
        durationDays: plan.durationDays,
      },
      prefill: {
        name: user.fullName,
        email: user.email,
        contact: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Unable to create Razorpay order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      planId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const plan = getPlanConfig(planId);

    if (!plan || plan.amount <= 0) {
      return res.status(400).json({ message: "Invalid paid plan selected" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const user = await getCurrentUser(req.user.id);
    await activateUserPlan(user, plan, {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });

    res.status(200).json({
      message: "Your plan has been activated successfully!",
      subscription: buildSubscriptionResponse(user),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Unable to verify payment",
    });
  }
};

export const getSubscription = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);

    res.status(200).json({
      subscription: buildSubscriptionResponse(user),
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || "Unable to fetch subscription",
    });
  }
};
