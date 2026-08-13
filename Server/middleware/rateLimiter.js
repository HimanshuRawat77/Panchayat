import redisClient from "../config/redis.js";

// In-memory fallback if Redis is unavailable
const memoryCache = new Map();

// Cleanup memory cache periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of memoryCache.entries()) {
    if (now > data.resetTime) {
      memoryCache.delete(key);
    }
  }
}, 60000);

export const aiRateLimiter = async (req, res, next) => {
  try {
    const userId = req.user?._id || "anonymous";
    const limit = parseInt(process.env.AI_RATE_LIMIT || "10", 10);
    const windowSec = parseInt(process.env.AI_RATE_WINDOW || "60", 10);
    const key = `ratelimit:ai:${userId}`;

    if (redisClient.isOpen) {
      // Redis is available, use it for rate limiting
      const current = await redisClient.incr(key);

      if (current === 1) {
        // Set expiry on first request
        await redisClient.expire(key, windowSec);
      }

      if (current > limit) {
        console.warn(`🔴 Rate-limit rejection (Redis) for user ${userId}`);
        return res.status(429).json({
          message:
            "Too many requests to the AI Assistant. Please try again later.",
        });
      }
    } else {
      // Redis is unavailable, fallback to single-instance in-memory map
      const now = Date.now();
      const record = memoryCache.get(key) || {
        count: 0,
        resetTime: now + windowSec * 1000,
      };

      // Reset if window has passed
      if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + windowSec * 1000;
      }

      record.count += 1;
      memoryCache.set(key, record);

      if (record.count > limit) {
        console.warn(
          ` Rate-limit rejection (Memory Fallback) for user ${userId}`
        );
        return res.status(429).json({
          message:
            "Too many requests to the AI Assistant. Please try again later.",
        });
      }
    }

    next();
  } catch (error) {
    console.error("Rate Limiter Error:", error.message);
    // If rate limiter fails, allow the request so service isn't entirely blocked
    next();
  }
};
