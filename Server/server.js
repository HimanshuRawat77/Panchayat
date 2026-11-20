import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import redisClient from "./config/redis.js";
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import ruleRoutes from "./routes/ruleRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Connect to Database
connectDB();
connectRedis();

const app = express();
const startedAt = Date.now();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

import societyRoutes from "./routes/societyRoutes.js";

// Routes
app.get("/api/health", (_req, res) => {
  const mongoStates = ["disconnected", "connected", "connecting", "disconnecting"];
  const mongo = mongoStates[mongoose.connection.readyState] || "unknown";
  const redis = redisClient.isReady ? "connected" : redisClient.isOpen ? "connecting" : "disconnected";
  const healthy = mongo === "connected" && redis === "connected";
  const unavailable = mongo === "disconnected" || mongo === "unknown";
  const status = healthy ? "healthy" : unavailable ? "unhealthy" : "degraded";

  res.status(healthy ? 200 : 503).json({
    status,
    uptime: Math.floor((Date.now() - startedAt) / 1000),
    services: { mongodb: mongo, redis },
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/rules", ruleRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/societies", societyRoutes);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `✅ Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
  });
}
export default app;
