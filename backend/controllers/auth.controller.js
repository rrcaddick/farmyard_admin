const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  getCookieOptions,
  revokeRefreshToken,
  blackListAccessToken,
  verifyToken,
  getResetTokenStatus,
  clearResetToken,
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
  const { redisClient } = req;

  const mailTransport = createMailerTransporter();
  const { id } = await User.findOne({ email });

  if (!id) {
    mailTransport.sendMail({
      to: [{ email }],
      from: { name: "Farmyard Admin", email: "reset-password@farmyard-admin.co.za" },
      subject: "Password Reset",
      html: noUserEmail,
    });
  } else {
    const resetToken = await generateResetToken(id, redisClient);

    mailTransport.sendMail({
      to: [{ email }],
      from: { name: "Farmyard Admin", email: "reset-password@farmyard-admin.co.za" },
      subject: "Password Reset",
      html: resetEmail`${id.toString()}${resetToken}`,
    });
  }

  res.status(200).json({
    message: "Password reset mail sent",
  });
});

const resetPasswordController = asyncHandler(async (req, res) => {
  const { redisClient } = req;
  const { userId, token, newPassword } = req.body;

  try {
    // 1. Validate token and get user
    const { userId: tokenUserId } = verifyToken(token, process.env.JWT_RESET_SECRET);
    if (userId !== tokenUserId) throw new Error("Invalid token");

    // 2. Check redis for token
    const isValidToken = await getResetTokenStatus(userId, redisClient, token);

    // 3. If fail return throw error and return failed
    if (!isValidToken) throw new Error("Password reset token expired");

    // 4. Find user and update password
    await User.findByIdAndUpdate(userId, { password: newPassword });

    try {
      await clearResetToken(userId, redisClient, token);
    } catch (error) {
      console.log(error);
    }

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(401);
    throw new Error("Password reset failed");
  }
});

module.exports = {
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
};
