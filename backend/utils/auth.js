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

const generateRefreshToken = async (user) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRY;

  const newRefreshToken = jwt.sign({ userId: user._id }, refreshSecret, { expiresIn: refreshExpiry });

  await user.rotateRefreshToken(newRefreshToken);

  return newRefreshToken;
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
    ? { ...(rememberMe && { maxAge: refreshExpiry }), httpOnly: true, sameSite: true }
    : { ...(rememberMe && { maxAge: refreshExpiry }), httpOnly: true, sameSite: true, secure: true };
};

module.exports = {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken,
  getCookieOptions,
};
