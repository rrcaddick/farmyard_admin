const { object, string, number, array } = require("yup");
const { createGroupContactSchema, updateContactSchema } = require("../contact/schemas");

const createGroupSchema = object().shape({
  name: string()
    .required("You must provide a group name")
    .test(function (value) {
      return true;
    }),
  groupType: object().test("requiredShape", "Please select a valid group type", function ({ id, type, price }) {
    if (!id || !type || !price) return false;
    return true;
  }),
  address: object().shape({
    street: string().required("You must provide a street address"),
    suburb: string().required("You must provide a suburb"),
    postCode: number().required("You must provide a postal code"),
  }),
  contacts: array().of(createGroupContactSchema),
});

const updateGroupSchema = object().shape({
  name: string().when({
    is: (value) => {
      const exists = !!value || value === "";
      return exists;
    },
    then: () => string().required("You must provide a group name"),
  }),
  groupType: object().when({
    is: (exists) => !!exists,
    then: () =>
      // Allows one error message for the whole object
      object().test("requiredShape", "Please select a valid group type", function ({ id, type, price }) {
        if (!id || !type || !price) return false;
        return true;
      }),
  }),
  address: object().shape({
    street: string().when({
      is: (exists) => !!exists,
      then: () => string().required("You must provide a street address"),
    }),
    suburb: string().when({ is: (exists) => !!exists, then: () => string().required("You must provide a suburb") }),
    postCode: number().when({
      is: (exists) => !!exists,
      then: () => number().required("You must provide a postal code").typeError("Street should be of type number"),
    }),
  }),
  contacts: array().of(updateContactSchema),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
};
