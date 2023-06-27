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
    updateContact: (_, { input }, { dataSources: { contactSource } }) => contactSource.updateContact(input),
    deleteContacts: (_, { contactIds }, { dataSources: { contactSource } }) => contactSource.deleteContacts(contactIds),
    restoreContacts: (_, { contactIds, restoreInfo }, { dataSources: { contactSource } }) =>
      contactSource.restoreContacts(contactIds, restoreInfo),
  },
};

module.exports = {
  resolvers,
};
