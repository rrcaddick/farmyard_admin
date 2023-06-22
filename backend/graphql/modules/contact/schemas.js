const { object, string } = require("yup");

//TODO: Clense tel
//TODO: Make email and tel unique - Requires db to be dropped to create proper indexes
const createContact = {
  schema: object().shape(
    {
      name: string().required("You need to provide a contact name"),
      email: string().when("tel", {
        is: (tel) => {
          return !tel || tel.length === 0;
        },
        then: () =>
          string().required("You must provide at least 1 contact method").email("Please enter a valid email address"),
        otherwise: () => string().email("Invalid email address"),
      }),
      tel: string()
        .transform((value) => (value === "" ? undefined : value))
        .when("email", {
          is: (email) => {
            return !email || email.length === 0;
          },
          then: () => string().required("You must provide at least 1 contact method"),
        }),
    },
    [["email", "tel"]]
  ),
};

//TODO: Bug Fix: Update throw error when removing either tel or email
const updateContact = {
  schema: object().shape(
    {
      name: string().when({
        is: (exists) => !!exists,
        then: () => string().required("You need to provide a contact name"),
      }),
      email: string().when("tel", {
        is: (tel) => {
          return !tel || tel.length === 0;
        },
        then: () =>
          string().required("You must provide at least 1 contact method").email("Please enter a valid email address"),
        otherwise: () => string().email("Invalid email address"),
      }),
      tel: string()
        .transform((value) => (value === "" ? undefined : value))
        .when("email", {
          is: (email) => {
            return !email || email.length === 0;
          },
          then: () => string().required("You must provide at least 1 contact method"),
        }),
    },
    [["email", "tel"]]
  ),
};

module.exports = {
  createContactSchema: createContact.schema,
  updateContactSchema: updateContact.schema,
};
