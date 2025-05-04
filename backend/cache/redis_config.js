const { createClient } = require('redis');

let redisClient;
let redisConnected = false;

// Initialize Redis connection
async function connectRedis() {
    redisClient = createClient({
        socket: {
            host: process.env.REDIS_HOST || 'redis',
            port: process.env.REDIS_PORT || 6379
        }
    });

    redisClient.on('error', (err) => {
        console.error('Redis connection error:', err.message);
        redisConnected = false;
    });

    redisClient.on('connect', () => {   
        console.log('Redis connected');
        redisConnected = true;
    });

    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Failed to connect Redis initially:', err.message);
        redisConnected = false;
    }
}


//========================================================================
// Get cached data by key
async function getCache(key) {
    if (redisConnected) {
        try {
            return await redisClient.get(key);
        } catch (err) {
            console.error('Redis get error:', err.message);
        }
    }
    return null;
}

// Set cached data with TTL (default: 10 minutes)
async function setCache(key, value, ttlSeconds = 600) {
    if (redisConnected) {
        try {
            await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
        } catch (err) {
            console.error('Redis set error:', err.message);
        }
    }
}

// Delete cached data by key
async function delCache(key) {
    if (redisConnected) {
        try {
            await redisClient.del(key);
            console.log(`Cache deleted for key: ${key}`);
        } catch (err) {
            console.error('Redis delete error:', err.message);
        }
    }
}

// Close Redis connection (optional, for graceful shutdown)
async function disconnectRedis() {
    if (redisConnected) {
        await redisClient.quit();
    }
}

module.exports = {
    connectRedis,
    getCache,
    setCache,
    delCache, 
    disconnectRedis,
    redisConnected
};