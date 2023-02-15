const router = require("express").Router();
const { validate } = require("../middleware/validate");
const { loginSchema, resetPasswordSchema } = require("../validators/auth.validators");
const { validateRefreshToken } = require("../middleware/authenticate");
const {
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

// Login
router.post("/login", validate(loginSchema), loginController);

// Logout
router.get("/logout", logoutController);

// Refresh Token
router.get("/refresh-Token", validateRefreshToken, refreshTokenController);

// Forgot Password
router.post("/forgot-Password", forgotPasswordController);

// Reset Password
router.post("/reset-Password", validate(resetPasswordSchema), resetPasswordController);

module.exports = router;
