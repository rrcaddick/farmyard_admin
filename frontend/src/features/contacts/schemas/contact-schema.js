import { object, string } from "yup";

const contactSchema = object().shape(
  {
    name: string().required("Contact name is required"),
    email: string().when("tel", {
      is: (tel) => {
        return !tel || tel.length === 0;
      },
      then: () => string().required("At least 1 contact method is required").email("Invalid email address"),
      otherwise: () => string().email("Invalid email address"),
    }),
    tel: string().when("email", {
      is: (email) => {
        const test = !email || email.length === 0;
        return test;
      },
      then: () => string().required("At least 1 contact method is required"),
      otherwise: () => string(),
    }),
  },
  [["email", "tel"]]
);

export { contactSchema };
