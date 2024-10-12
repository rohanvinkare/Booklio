const NodeCache = require("node-cache");

// Create a new cache instance with a default TTL of 3600 seconds (1 hour)
const cache = new NodeCache({ stdTTL: 3600 });

/**
 * Set a value in the cache with a specified key
 * @param {string} key
 * @param {any} value
 */
const setCache = (key, value) => {
  cache.set(key, value);
};

/**
 * Get a value from the cache using the specified key
 * @param {string} key
 * @returns {any}
 */
const getCache = (key) => {
  return cache.get(key);
};

/**
 * Remove a value from the cache using the specified key
 * @param {string} key
 */
const delCache = (key) => {
  cache.del(key);
};

module.exports = {
  setCache,
  getCache,
  delCache,
};
