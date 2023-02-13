const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

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

module.exports = authenticate;
