const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const authenticate = asyncHandler((req, res, next) => {
  // Retrieve tokens
  const { refreshToken } = req?.cookies;

  const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  // Either first login or public route. Also manages revoked access
  if (!refreshToken) return next();

  // Persistent login requiring new access token
  if (refreshToken && !token) {
    // TODO: Add refresh logic
  }

  // Normal authentication. Failed verification still proceeds to allow public routes
  try {
    const { userId } = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // TODO: Could fetch the user here if it becomes required

    req.userId = userId;

    return next();
  } catch {
    return next();
  }
});

const validateRefreshToken = asyncHandler(async (req, res, next) => {
  const {
    cookies: { refreshToken },
  } = req;

  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.status(403);
    throw new Error("Invalid token");
  }

  try {
    const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (user._id.toString() !== userId) throw new Error("Invalid token");

    req.user = user;

    return next();
  } catch {
    res.status(403);
    throw new Error("Invalid token");
  }
});

module.exports = {
  authenticate,
  validateRefreshToken,
};
