const { generateTempId } = require("@graphql/utils/generate-temp-id");

const groupResponseSchema = {
  __typename: "Group",
  id: () => generateTempId("Group"),
  name: 1,
  groupType: 1,
  address: {
    __typename: "Address",
    street: 1,
    suburb: 1,
    postCode: 1,
  },
  contacts: [
    {
      __typename: "Contact",
      id: () => generateTempId("Contact"),
      type: "Group",
      name: 1,
      email: 1,
      tel: 1,
    },
  ],
};

const createResponseSchema = {
  createGroup: {
    ...groupResponseSchema,
  },
};

const updateResponseSchema = {
  updateGroup: {
    ...groupResponseSchema,
  },
};

export { createResponseSchema, updateResponseSchema };
