const yup = require("yup");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

// TODO: Add structure validation to body - Change from validating req to body
// const loginSchema = yup.object().shape({
//   body: yup.object().test("login-valid", "Invalid email or password", async function () {
//     return true;
//   }),
// });

// const resetPasswordSchema = yup.object().shape({
//   body: yup.object().test("passwords-match", "Passwords don't match", async function () {
//     const { userId, token, newPassword, confirmPassword } = this.originalValue;

//     // Requires all values in order to pass
//     if (!userId || !token || !newPassword || !confirmPassword) return false;

//     if (newPassword !== confirmPassword) return false;

//     return true;
//   }),
// });

const loginSchema = yup.object().shape({
  body: yup.object().shape({
    email: yup.string().required("Email address is required").email("Invalid email"),
    password: yup.string().required("Password is required"),
  }),
});

const resetPasswordSchema = yup.object().shape({
  body: yup.object().shape({
    userId: yup.string().required("User ID is required"),
    token: yup.string().required("Token is required"),
    newPassword: yup
      .string()
      .required("New Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  }),
});

module.exports = {
  loginSchema,
  resetPasswordSchema,
};
