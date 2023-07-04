const { isValidObjectId } = require("mongoose");
const { object, string, lazy } = require("yup");

//TODO: Make email and tel unique - Requires db to be dropped to create proper indexes
const createContact = {
  schema: object().shape({
    type: string().required("Contact type is required"),
    name: string().required("Contact name is required"),
    email: lazy((value) => {
      if (!!value) {
        return string().email("Invalid email address");
      }

      return string().when("tel", {
        is: (tel) => {
          return !tel || tel.length === 0;
        },
        then: () => string().required("You must provide at least 1 contact method"),
      });
    }),
    tel: lazy((value) => {
      if (!!value) {
        const number = value.slice(0, 3) === ("+27" || "27") ? value : `+27${value}`;
        return !!isValidPhoneNumber(number)
          ? string().transform(() => {
              const phoneNumber = parsePhoneNumber(number);
              return phoneNumber.nationalNumber;
            })
          : string().test("PhoneNumber", "Invalid phone number", () => false);
      }

      return string().when("email", {
        is: (email) => {
          return !email || email.length === 0;
        },
        then: () => string().required("At least 1 contact method is required"),
      });
    }),
    // groupId: string().when("type", {
    //   is: (value) => value === "Group",
    //   then: () =>
    //     string()
    //       .required("Group is required")
    //       .test("ObjectId", "Invalid Group", (value) => isValidObjectId(value ?? "")),
    // }),
  }),
};

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
