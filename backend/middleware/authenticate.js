const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const {
  getCookieOptions,
  verifyToken,
  generateAccessToken,
  shouldBlacklist,
  getRefreshTokenStatus,
  rotateRefreshToken,
  getToken,
} = require("../utils/auth");

const authenticate = asyncHandler(async (req, res, next) => {
  // Retrieve tokens
  const { redisClient } = req;
  const { refreshToken } = req?.cookies;

  const token = getToken(req);

  // No Access token or Refresh token - Public route or first login
  if (!refreshToken && !token) return next();

  // Check access token against Redis blacklist
  const isToken = token && !(await shouldBlacklist(token, redisClient));

  if (isToken) {
    // Check if token is valid
    const { userId: accessTokenUserId } = verifyToken(token, process.env.JWT_ACCESS_SECRET);

    // Valid access token
    if (accessTokenUserId) {
      req.userId = accessTokenUserId;
      req.token = token;
      return next();
    }
  }

  // No Refresh token - Move on without authentication
  if (!refreshToken) return next();

  // Token is invalid, blacklisted or undefined - Attempt to refresh
  const { userId: refreshTokenUserId } = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Check Redis cache for userId to see if refresh token is still active
  const isActiveRefreshToken = await getRefreshTokenStatus(refreshTokenUserId, redisClient, refreshToken);

  // Valid Refresh token
  if (isActiveRefreshToken) {
    req.userId = refreshTokenUserId;
    res.setHeader("x-access-token", generateAccessToken(refreshTokenUserId));

    const { refreshToken: newRefreshToken, rememberMe } = await rotateRefreshToken(
      refreshTokenUserId,
      redisClient,
      refreshToken
    );

    res
      .clearCookie("refreshToken", getCookieOptions(rememberMe))
      .cookie("refreshToken", newRefreshToken, getCookieOptions(rememberMe));

    // CORS: Uncomment if client from different origin
    // res.setHeader("Access-Control-Expose-Headers", "x-access-token");
    return next();
  }

  // Invalid Refresh token - Clear refresh token and move on
  res.clearCookie("refreshToken", getCookieOptions(false));
  return next();
});

module.exports = {
  authenticate,
};
