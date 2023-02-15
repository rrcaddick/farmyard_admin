import * as yup from "yup";

const loginSchema = yup.object({
  email: yup.string().email("Please enter a valid email address").required("Your email address is required"),
  password: yup.string().required("Please enter a valid password"),
});

export { loginSchema };
