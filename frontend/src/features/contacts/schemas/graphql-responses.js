const { generateTempId } = require("@graphql/utils/generate-temp-id");

const contactResponseSchema = {
  __typename: "Contact",
  id: () => generateTempId("Contact"),
  type: "Group",
  name: 1,
  email: 1,
  tel: 1,
  groupId: 1,
};

const createResponseSchema = {
  createContact: {
    ...contactResponseSchema,
  },
};

const updateResponseSchema = {
  updateContact: {
    ...{ ...contactResponseSchema, id: 1 },
  },
};

export { createResponseSchema, updateResponseSchema };
