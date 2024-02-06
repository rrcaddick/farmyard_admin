const Redis = require("ioredis");
const client = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
});

const redisClient = (req, res, next) => {
  req.redisClient = client;
  return next();
};

module.exports = { redisClient };
