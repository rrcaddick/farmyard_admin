const resolvers = {
  Query: {
    getContact: (_, { contactId }, { dataSources: { contactSource } }) => contactSource.getContact(contactId),
    getContacts: (_, { contactIds }, { dataSources: { contactSource } }) => contactSource.getContacts(contactIds),
  },
  Contact: {
    id: ({ _id }) => _id,
  },
  Mutation: {
    createContact: (_, { input, groupId }, { dataSources: { contactSource } }) =>
      contactSource.createContact(input, groupId),
  },
};

module.exports = {
  resolvers,
};
