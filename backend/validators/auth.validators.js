const yup = require("yup");
const { User } = require("../models/user");

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

module.exports = {
  loginSchema,
};
