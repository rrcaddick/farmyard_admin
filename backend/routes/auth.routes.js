const router = require("express").Router();
const { validate } = require("../middleware/validate");
const { loginSchema } = require("../validators/auth.validators");
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
router.post("/refreshToken", refreshTokenController);

// Forgot Password
router.get("/forgotPassword", forgotPasswordController);

module.exports = router;
