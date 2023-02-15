import * as yup from "yup";

const resetPasswordSchema = yup.object({
  newPassword: yup.string().required("Please enter a new password"),
  confirmPassword: yup.string().test("passwords-match", "Passwords don't match", function (value) {
    return this.parent.newPassword === value;
  }),
});

export { resetPasswordSchema };
