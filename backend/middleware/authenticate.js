const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { verifyToken, generateAccessToken } = require("../utils/auth");

const authenticate = asyncHandler((req, res, next) => {
  // Retrieve tokens
  const { refreshToken } = req?.cookies;

  const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];

  // Either first login or public route. Also manages revoked access
  if (!refreshToken && process.env.NODE_ENV !== "development") return next();

  // Test token
  const { userId: accessTokenUserId } = verifyToken(token, process.env.JWT_ACCESS_SECRET);

  // Valid access token
  if (accessTokenUserId) {
    req.userId = accessTokenUserId;
    return next();
  }

  // Test refresh token, if access token not valid or present
  const { userId: refreshTokenUserId } = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Valid refresh token
  if (refreshTokenUserId) {
    req.userId = refreshTokenUserId;
    res.setHeader("x-access-token", generateAccessToken(refreshTokenUserId));
    // CORS: Uncomment if client from different origin
    // res.setHeader("Access-Control-Expose-Headers", "x-access-token");
    return next();
  }

  // No authentication
  return next();
});

module.exports = {
  authenticate,
};
