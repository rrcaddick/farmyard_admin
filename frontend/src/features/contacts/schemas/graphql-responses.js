const { generateTempId } = require("@graphql/utils/generate-temp-id");

const contactResponseSchema = {
  __typename: "Contact",
  id: () => generateTempId("Group"),
  type: "Group",
  name: 1,
  email: 1,
  tel: 1,
};

const createResponseSchema = {
  createContact: {
    ...contactResponseSchema,
  },
};

const updateResponseSchema = {
  updateContact: {
    ...contactResponseSchema,
  },
};

export { createResponseSchema, updateResponseSchema };
