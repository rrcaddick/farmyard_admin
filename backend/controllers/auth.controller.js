const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken, generateResetToken } = require("../utils/auth");
const { refreshCookieOptions } = require("../config/refresh-cookie-options");
const { User } = require("../models/user");
const { createMailerTransporter } = require("../utils/node-mailer");
const { resetEmail } = require("../mail/email-templates");

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

const refreshTokenController = asyncHandler(async (req, res) => {
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

const forgotPasswordController = asyncHandler((req, res) => {
  const { email } = req.body;

  const token = generateResetToken(email);

  const mailTransport = createMailerTransporter();
  mailTransport.sendMail({
    to: [{ email: "farmyard.park@gmail.com" }],
    from: { name: "Farmyard Admin", email: "reset-password@farmyard-admin.co.za" },
    subject: "Password Reset",
    html: resetEmail`${token}`,
  });

  res.status(200).json({
    message: "Password reset mail sent",
  });
});

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
};
