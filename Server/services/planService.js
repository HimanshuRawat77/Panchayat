export const PLAN_CONFIG = {
  free: {
    id: "free",
    name: "Free",
    amount: 0,
    durationDays: 30,
  },
  quarterly: {
    id: "quarterly",
    name: "Quarterly",
    amount: 15000,
    durationDays: 90,
  },
  "half-yearly": {
    id: "half-yearly",
    name: "Half Yearly",
    amount: 28000,
    durationDays: 180,
  },
  annual: {
    id: "annual",
    name: "Annual",
    amount: 55000,
    durationDays: 365,
  },
};

export const getPlanConfig = (planId) => PLAN_CONFIG[planId];

export const addDays = (date, days) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

export const getDaysRemaining = (expiresAt) => {
  if (!expiresAt) return 0;

  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

export const refreshUserPlanStatus = async (user) => {
  if (!user) return user;

  if (
    user.planStatus === "active" &&
    user.planExpiresAt &&
    new Date(user.planExpiresAt).getTime() < Date.now()
  ) {
    user.planStatus = "expired";
    await user.save();
  }

  return user;
};

export const buildSubscriptionResponse = (user) => {
  const planExpiresAt = user.planExpiresAt || null;
  const planActivatedAt = user.planActivatedAt || null;

  return {
    currentPlan: user.subscriptionMode || "Free",
    planStatus: user.planStatus || "inactive",
    activationDate: planActivatedAt,
    expiryDate: planExpiresAt,
    daysRemaining: getDaysRemaining(planExpiresAt),
  };
};

export const activateUserPlan = async (user, plan, payment = {}) => {
  const now = new Date();

  user.subscriptionMode = plan.name;
  user.planStatus = "active";
  user.planActivatedAt = now;
  user.planExpiresAt = addDays(now, plan.durationDays);
  user.razorpayOrderId = payment.orderId || "";
  user.razorpayPaymentId = payment.paymentId || "";

  await user.save();
  return user;
};
