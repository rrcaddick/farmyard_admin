const { object, string, ref } = require("yup");

const loginSchema = object().shape({
  email: string().required("Email address is required").email("Invalid email"),
  password: string().required("Password is required"),
});

const resetPasswordSchema = object().shape({
  userId: string().required("User ID is required"),
  token: string().required("Token is required"),
  newPassword: string().required("New Password is required").min(8, "Password must be at least 8 characters long"),
  confirmPassword: string()
    .required("Confirm Password is required")
    .oneOf([ref("newPassword")], "Passwords do not match"),
});

module.exports = {
  loginSchema,
  resetPasswordSchema,
};
