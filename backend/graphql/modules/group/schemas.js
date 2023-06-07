const { object, string, number, array } = require("yup");
const { createContactSchema, updateContactSchema } = require("../contact/schemas");

const getSchema = (schemaName) => {
  return this[schemaName];
};

const createGroup = {
  // Allows one error message for the whole object
  groupTypeSchema: object().test("requiredShape", "Please select a valid group type", function ({ id, type, price }) {
    if (!id || !type || !price) return false;
    return true;
  }),
  addressSchema: object().shape({
    street: string().when({
      is: (exists) => !!exists,
      then: () => string().required("You must provide a street address"),
    }),
    suburb: string().required("You must provide a suburb"),
    postCode: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .required("You must provide a postal code"),
  }),
  schema: object().shape({
    name: string().required("You must provide a group name"),
    groupType: getSchema("groupTypeSchema"),
    address: getSchema("addressSchema"),
    contacts: array().of(createContactSchema),
  }),
};

const updateGroup = {
  groupTypeSchema: object().when({
    is: (exists) => !!exists,
    then: () =>
      // Allows one error message for the whole object
      object().test("requiredShape", "Please select a valid group type", function ({ id, type, price }) {
        if (!id || !type || !price) return false;
        return true;
      }),
  }),
  addressSchema: object().shape({
    street: string().when({
      is: (exists) => !!exists,
      then: () => string().required("You must provide a street address"),
    }),
    suburb: string().when({ is: (exists) => !!exists, then: () => string().required("You must provide a suburb") }),
    postCode: number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .nullable()
      .when({ is: (exists) => !!exists, then: () => string().number("You must provide a postal code") })
      .typeError("Street should be of type number"),
  }),
  schema: object().shape({
    name: string().when({
      is: (exists) => !!exists,
      then: () => string().required("You must provide a group name"),
    }),
    groupType: getSchema("groupTypeSchema"),
    address: getSchema("addressSchema"),
    contacts: array().of(updateContactSchema),
  }),
};

module.exports = {
  createGroupSchema: createGroup.schema,
  updateGroupSchema: updateGroup.schema,
};
