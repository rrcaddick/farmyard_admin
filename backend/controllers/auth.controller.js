const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  getCookieOptions,
  revokeRefreshToken,
  blackListAccessToken,
} = require("../utils/auth");
const { User } = require("../models/user");
const { createMailerTransporter } = require("../utils/node-mailer");
const { resetEmail, noUserEmail } = require("../mail/templates/email-templates");

const loginController = asyncHandler(async (req, res) => {
  const {
    body: { email, password, rememberMe },
    redisClient,
  } = req;

  try {
    const user = await User.findOne({ email });
    const { id, email: userEmail, name, position, mobile, roles } = user;
    const isValid = await user.validatePassword(password);
    if (!isValid) throw new Error();

    // Create new token and write to redis client
    const { refreshToken } = await generateRefreshToken(id, redisClient, rememberMe);

    res
      .status(200)
      .clearCookie("refreshToken", getCookieOptions(rememberMe))
      .cookie("refreshToken", refreshToken, getCookieOptions(rememberMe))
      .setHeader("x-access-token", generateAccessToken(id))
      .json({ id, email: userEmail, name, position, mobile, roles });
  } catch (error) {
    res.status(403);
    throw new Error("Invalid email or password");
  }
});

const logoutController = asyncHandler(async (req, res) => {
  const { userId, token, redisClient } = req;
  const { refreshToken } = req?.cookies;

  try {
    // TODO: Add Access token to redis blacklist
    await blackListAccessToken(redisClient, token);
    // TODO: Remove Refresh token from Redis store
    if (userId && refreshToken) await revokeRefreshToken(userId, redisClient, refreshToken);
    res.status(200).clearCookie("refreshToken", getCookieOptions(false)).json({
      message: "Succesfully logged out",
    });
  } catch (error) {
    res.status(500).clearCookie("refreshToken", getCookieOptions(false));
    throw new Error("An error occured trying to log out");
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
  forgotPasswordController,
  resetPasswordController,
};
