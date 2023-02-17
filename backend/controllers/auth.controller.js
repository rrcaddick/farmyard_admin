const path = require("path");
const asyncHandler = require("express-async-handler");
const { generateAccessToken, generateRefreshToken, generateResetToken, getCookieOptions } = require("../utils/auth");
const { User } = require("../models/user");
const { createMailerTransporter } = require("../utils/node-mailer");
const { resetEmail, noUserEmail } = require("../mail/templates/email-templates");

const loginController = asyncHandler(async (req, res) => {
  const {
    user,
    body: { rememberMe },
  } = req;

  const { id, email, name, position, mobile, roles } = user;

  try {
    const refreshToken = await generateRefreshToken(user);
    res
      .status(200)
      .clearCookie("refreshToken", getCookieOptions(rememberMe))
      // .setHeader("Access-Control-Allow-Headers", "X-Requested-With")
      .setHeader("x-access-token", generateAccessToken(user))
      .cookie("refreshToken", refreshToken, getCookieOptions(rememberMe))
      .json({ id, email, name, position, mobile, roles });
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

const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const mailTransport = createMailerTransporter();
  const user = await User.findOne({ email });

  if (!user) {
    mailTransport.sendMail({
      to: [{ email }],
      from: { name: "Farmyard Admin", email: "reset-password@farmyard-admin.co.za" },
      subject: "Password Reset",
      html: noUserEmail,
    });
  } else {
    const token = generateResetToken(email);
    user.resetToken = token;
    await user.save();

    mailTransport.sendMail({
      to: [{ email }],
      from: { name: "Farmyard Admin", email: "reset-password@farmyard-admin.co.za" },
      subject: "Password Reset",
      html: resetEmail`${user._id.toString()}${token}`,
    });
  }

  res.status(200).json({
    message: "Password reset mail sent",
  });
});

const resetPasswordController = asyncHandler(async (req, res) => {
  const {
    user,
    body: { newPassword },
  } = req;

  user.password = newPassword;
  user.resetToken = undefined;
  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
});

module.exports = {
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
};
