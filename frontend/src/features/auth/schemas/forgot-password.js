import * as yup from "yup";

const forgotPasswordSchema = yup.object({
  email: yup.string().email("Please enter a valid email address").required("Your email address is required"),
});

export { forgotPasswordSchema };
