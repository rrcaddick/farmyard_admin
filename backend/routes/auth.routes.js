const router = require("express").Router();
const { validate } = require("../middleware/validate");
const { loginSchema } = require("../validators/auth.validators");
const { validateRefreshToken } = require("../middleware/authenticate");
const {
  loginController,
  logoutController,
  refreshTokenController,
  forgotPasswordController,
} = require("../controllers/auth.controller");

// Login
router.post("/login", validate(loginSchema), loginController);

// Logout
router.get("/logout", logoutController);

// Refresh Token
router.get("/refreshToken", validateRefreshToken, refreshTokenController);

// Forgot Password
router.post("/forgotPassword", forgotPasswordController);

module.exports = router;
