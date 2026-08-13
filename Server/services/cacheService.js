import redisClient from '../config/redis.js';

/**
 * Get data from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<any|null>} - Parsed JSON data or null if miss/error
 */
export const getCache = async (key) => {
  try {
    if (!redisClient.isOpen) return null; // Fallback
    
    const data = await redisClient.get(key);
    if (data) {
      console.log(`🟢 Redis cache HIT for key: ${key}`);
      return JSON.parse(data);
    }
    
    console.log(`🟡 Redis cache MISS for key: ${key}`);
    return null;
  } catch (error) {
    console.error(`🔴 Redis GET error for key ${key}:`, error.message);
    return null; // Graceful fallback
  }
};

/**
 * Set data in Redis cache with TTL
 * @param {string} key - Cache key
 * @param {any} value - Data to cache
 * @param {number} ttlSeconds - Time to live in seconds
 */
export const setCache = async (key, value, ttlSeconds) => {
  try {
    if (!redisClient.isOpen) return;
    
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    console.log(`🔵 Redis cache SET for key: ${key} (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    console.error(`🔴 Redis SET error for key ${key}:`, error.message);
    // Continue normally, do not break the app
  }
};

/**
 * Invalidate (delete) a key from Redis cache
 * @param {string} key - Cache key
 */
export const invalidateCache = async (key) => {
  try {
    if (!redisClient.isOpen) return;
    
    await redisClient.del(key);
    console.log(`🟠 Redis cache INVALIDATION for key: ${key}`);
  } catch (error) {
    console.error(`🔴 Redis DELETE error for key ${key}:`, error.message);
    // Continue normally
  }
};
