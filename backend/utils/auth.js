const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const saltRounds = Number(process.env.HASH_SALT_ROUNDS);
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const generateAccessToken = ({ _id: userId, email, name, position, roles }) => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const accessExpiry = process.env.JWT_ACCESS_EXPIRY;
  return jwt.sign({ userId, email, name, position, roles }, accessSecret, { expiresIn: accessExpiry });
};

const generateRefreshToken = async (user) => {
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRY;

  // TODO: Check for persistant login
  const newRefreshToken = jwt.sign({ userId: user._id }, refreshSecret, { expiresIn: refreshExpiry });
  await user.rotateRefreshToken(newRefreshToken);

  return newRefreshToken;
};

module.exports = {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
};
