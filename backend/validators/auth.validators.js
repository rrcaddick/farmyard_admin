const yup = require("yup");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const loginSchema = yup.object().shape({
  body: yup.object().test("login-valid", "Invalid email or password", async function () {
    const { email, password } = this.originalValue;
    const req = this.parent;

    if (!email || !password) return false;

    const user = await User.findOne({ email });
    if (!user || !(await user.validatePassword(password))) return false;

    req.user = user;
    return true;
  }),
});

const resetPasswordSchema = yup.object().shape({
  body: yup
    .object()
    .test("passwords-match", "Passwords don't match", async function () {
      const { userId, token, newPassword, confirmPassword } = this.originalValue;

      if (newPassword !== confirmPassword) return false;

      return true;
    })
    .test("token-valid", "Your password link is expired or invalid", async function () {
      const { userId, token, newPassword, confirmPassword } = this.originalValue;
      const req = this.parent;

      if (!userId || !token || !newPassword || !confirmPassword) return false;

      try {
        const { email } = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await User.findById(userId);

        if (user.email !== email || user.resetToken !== token) return false;

        req.user = user;
        return true;
      } catch (error) {
        return false;
      }
    }),
});

module.exports = {
  loginSchema,
  resetPasswordSchema,
};
