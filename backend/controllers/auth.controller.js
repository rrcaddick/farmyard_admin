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
      .cookie("refreshToken", refreshToken, getCookieOptions(rememberMe))
      .setHeader("x-access-token", generateAccessToken(id))
      .json({ id, email, name, position, mobile, roles });
  } catch (error) {
    res.status(403);
    throw new Error("Invalid email or password");
  }
});

const logoutController = asyncHandler(async (req, res) => {
  const { userId } = req;

  try {
    // TODO: Decide on keeping refresh tokens in the db
    if (userId) await User.revokeRefreshToken(userId);
    res.status(200).clearCookie("refreshToken", getCookieOptions(false)).json({
      message: "Succesfully logged out",
    });
  } catch (error) {
    res.status(500).clearCookie("refreshToken", getCookieOptions(false));
    throw error;
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
