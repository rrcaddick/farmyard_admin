const resolvers = {
  Query: {
    getContact: (root, { contactId }, { dataSources: { contactSource } }) => contactSource.getContact(contactId),
    getContacts: (root, args, { dataSources: { contactSource } }, info) => contactSource.getContacts(),
  },
  Contact: {
    id: ({ _id }, args, context) => _id,
  },
  Mutation: {
    createContact: (_root, { input, groupId }, { dataSources: { contactSource } }) =>
      contactSource.createContact(input, groupId),
  },
};

module.exports = {
  resolvers,
};
