const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");

const hashPassword = async (password) => {
  const saltRounds = Number(process.env.HASH_SALT_ROUNDS);
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const generateAccessToken = (userId) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const accessExpiry = process.env.JWT_ACCESS_EXPIRY;
  return jwt.sign({ userId }, accessSecret, { expiresIn: accessExpiry });
};

const generateRefreshToken = async (userId, redisClient, rememberMe) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRY;
  const cacheExpiry = ms(refreshExpiry);

  const refreshToken = jwt.sign({ userId }, refreshSecret, { expiresIn: refreshExpiry });

  const cacheKey = `RefreshTokens:${userId}:${refreshToken}`;

  const cacheValue = JSON.stringify({ token: refreshToken, rememberMe });

  await redisClient.set(cacheKey, cacheValue, "EX", cacheExpiry);

  return { refreshToken, rememberMe };
};

const rotateRefreshToken = async (userId, redisClient, oldToken) => {
  const oldKey = `RefreshTokens:${userId}:${oldToken}`;

  const cachedValue = await redisClient.get(oldKey);

  const { rememberMe } = JSON.parse(cachedValue);

  await redisClient.del(oldKey);

  return await generateRefreshToken(userId, redisClient, rememberMe);
};

const blackListAccessToken = async (redisClient, token) => {
  const key = `AccessBlacklist:${token}`;

  return await redisClient.set(key, "true");
};

const revokeRefreshToken = async (userId, redisClient, revokedToken) => {
  const key = `RefreshTokens:${userId}:${revokedToken}`;

  await redisClient.del(key);
};

const generateResetToken = (email) => {
  const resetSecret = process.env.JWT_RESET_SECRET;
  const resetExpiry = process.env.JWT_RESET_EXPIRY;
  return jwt.sign({ email }, resetSecret, { expiresIn: resetExpiry });
};

const verifyToken = (token, secret) => {
  let payload = {};

  // Swallows verify error and returns null for bad token
  try {
    payload = jwt.verify(token, secret);
  } finally {
    return payload;
  }
};

const getCookieOptions = (rememberMe) => {
  const developer = process.env.NODE_ENV === "development";
  const refreshExpiry = ms(process.env.JWT_REFRESH_EXPIRY);

  return developer
    ? { ...(rememberMe && { maxAge: refreshExpiry }), httpOnly: true, sameSite: "Strict" }
    : { ...(rememberMe && { maxAge: refreshExpiry }), httpOnly: true, sameSite: "Strict", secure: true };
};

const shouldBlacklist = async (token, redisClient) => {
  const key = `AccessBlacklist:${token}`;

  return await redisClient.exists(key);
};

const getRefreshTokenStatus = async (userId, redisClient, refreshToken) => {
  const key = `RefreshTokens:${userId}:${refreshToken}`;

  return (await redisClient.exists(key)) === 1;
};

module.exports = {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  generateResetToken,
  verifyToken,
  getCookieOptions,
  shouldBlacklist,
  getRefreshTokenStatus,
  blackListAccessToken,
  revokeRefreshToken,
};
