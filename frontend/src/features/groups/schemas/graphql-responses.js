const { generateTempId } = require("@graphql/utils/generate-temp-id");

const groupResponseSchema = {
  __typename: "Group",
  id: () => generateTempId("Group"),
  name: 1,
  groupType: (groupType) => {
    const parsedGroupType = typeof groupType === "string" ? JSON.parse(groupType) : groupType;
    const { price, ..._groupType } = parsedGroupType;
    return { ..._groupType, price: { id: price } };
  },
  address: {
    __typename: "Address",
    street: 1,
    suburb: 1,
    postCode: 1,
  },
  contacts: [
    {
      __typename: "Contact",
      id: (id) => id || generateTempId("Contact"),
      type: "Group",
      name: 1,
      email: 1,
      tel: 1,
      groupId: 1,
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
    ...{ ...groupResponseSchema, id: 1 },
  },
};

export { createResponseSchema, updateResponseSchema };
