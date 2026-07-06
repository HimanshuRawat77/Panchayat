import API_BASE_URL from "../config";
import { getAuthToken } from "../utils/authStorage";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Payment request failed");
  }

  return data;
};

export const activateFreeTrial = async () => {
  const response = await fetch(`${API_BASE_URL}/payments/free-trial`, {
    method: "POST",
    headers: authHeaders(),
  });

  return parseResponse(response);
};

export const createPaymentOrder = async (planId) => {
  const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ planId }),
  });

  return parseResponse(response);
};

export const verifyPayment = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/payments/verify`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse(response);
};

export const getSubscription = async () => {
  const response = await fetch(`${API_BASE_URL}/payments/subscription`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  return parseResponse(response);
};

export const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay Checkout"));
    document.body.appendChild(script);
  });
