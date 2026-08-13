import { createClient } from 'redis';

// Create a Redis client instance
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis connection/disconnection/error:', err.message);
});

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis successfully');
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    // We intentionally don't throw to allow graceful degradation
  }
};

export default redisClient;
