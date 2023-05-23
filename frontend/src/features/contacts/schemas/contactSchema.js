import * as yup from "yup";

const contactSchema = yup.object().shape({
  name: yup.string().required("Contact name is required"),
  email: yup.string().email("Invalid email address").required("Email address is required"),
  tel: yup.string().required("Contact number is required"),
});

export { contactSchema };
