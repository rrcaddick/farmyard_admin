const { object, string, number, array } = require("yup");
const { contactSchema } = require("../contact/schema");

const groupTypeSchema = object().test(
  "requiredShape",
  "Please select a valid group type",
  function ({ id, type, price }, parent) {
    if (id === "" || type === "" || price === "") return false;
    return true;
  }
);

const addressSchema = object().shape({
  street: string().required("You must provide a street address"),
  suburb: string().required("You must provide a suburb"),
  postCode: number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable()
    .required("You must provide a postal code"),
});

const groupSchema = object().shape({
  name: string().required("You must provide a group name"),
  groupType: groupTypeSchema,
  address: addressSchema,
  contacts: array().of(contactSchema),
});

module.exports = {
  groupSchema,
};
