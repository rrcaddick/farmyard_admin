import { object, string } from "yup";

const contactSchema = object().shape(
  {
    name: string().required("Contact name is required"),
    email: string().when("tel", {
      is: (tel) => {
        return !tel || tel.length === 0;
      },
      then: () =>
        string().required("Either email address or contact number is required").email("Invalid email address"),
      otherwise: () => string().email("Invalid email address"),
    }),
    tel: string()
      .transform((value) => (value === "" ? undefined : value))
      .when("email", {
        is: (email) => {
          return !email || email.length === 0;
        },
        then: () => string().required("Either email address or contact number is required"),
      }),
  },
  [["email", "tel"]]
);

export { contactSchema };
