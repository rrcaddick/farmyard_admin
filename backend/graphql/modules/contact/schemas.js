const { isValidObjectId } = require("mongoose");
const { object, string, lazy } = require("yup");
const parsePhoneNumber = require("libphonenumber-js");

const createContactSchema = object().shape({
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
      return string().test("PhoneNumber", "Invalid phone number", (value) => {
        const phoneNumber = parsePhoneNumber(value, "ZA");
        return phoneNumber.isValid();
      });
    }

    return string().when("email", {
      is: (email) => {
        return !email || email.length === 0;
      },
      then: () => string().required("You must provide at least 1 contact method"),
    });
  }),

  groupId: string().when("type", {
    is: (value) => value === "Group",
    then: () =>
      string()
        .test("ObjectId", "Invalid Group", (value) => isValidObjectId(value))
        .required("Group is required"),
  }),
});

const updateContactSchema = object().shape({
  type: string(),
  name: string(),
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
      return string().test("PhoneNumber", "Invalid phone number", (value) => {
        const phoneNumber = parsePhoneNumber(value, "ZA");
        return phoneNumber.isValid();
      });
    }

    return string().when("email", {
      is: (email) => {
        return !email || email.length === 0;
      },
      then: () => string().required("You must provide at least 1 contact method"),
    });
  }),

  groupId: string().when("type", {
    is: (value) => value === "Group",
    then: () =>
      string()
        .test("ObjectId", "Invalid Group", (value) => isValidObjectId(value))
        .required("Group is required"),
  }),
});

module.exports = {
  createContactSchema,
  updateContactSchema,
};
