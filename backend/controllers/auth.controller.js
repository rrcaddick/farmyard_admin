const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken } = require("../utils/auth");
const { refreshCookieOptions } = require("../config/refreshCookieOptions");
const { User } = require("../models/user");

const loginController = asyncHandler(async (req, res) => {
  const { user } = req;
  try {
    const refreshToken = await generateRefreshToken(user);
    res
      .status(200)
      .clearCookie("refreshToken", refreshCookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .json({
        token: generateAccessToken(user),
      });
  } catch (error) {
    res.status(403);
    throw new Error("Unable to generate refresh token");
  }
});

const logoutController = asyncHandler(async (req, res) => {
  const { userId } = req;

  // If revokeRefreshToken fails, swallow error and send clearCookie response
  try {
    if (userId) await User.revokeRefreshToken(userId);
  } catch {}

  res.status(200).clearCookie("refreshToken", refreshCookieOptions).json({
    message: "Succesfully logged out",
  });
});

const refreshTokenController = asyncHandler((req, res) => {});

const forgotPasswordController = asyncHandler((req, res) => {});

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
};
