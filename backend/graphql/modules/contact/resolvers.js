const resolvers = {
  Query: {
    contact: (_, { contactId }, { dataSources: { contactSource } }) => contactSource.getContact(contactId),
    contacts: (_, { contactIds }, { dataSources: { contactSource } }) => contactSource.getContacts(contactIds),
    contactTypes: (_root, _args, { dataSources: { contactSource } }) => contactSource.getContactTypes(),
  },
  Contact: {
    id: ({ _id }) => _id,
  },
  Mutation: {
    createContact: (_, { input, groupId }, { dataSources: { contactSource } }) => contactSource.createContact(input),
    updateContact: (_, { input }, { dataSources: { contactSource } }) => contactSource.updateContact(input),
    deleteContacts: (_, { contactIds }, { dataSources: { contactSource } }) => contactSource.deleteContacts(contactIds),
    restoreContacts: (_, { contactIds, restoreInfo }, { dataSources: { contactSource } }) =>
      contactSource.restoreContacts(contactIds, restoreInfo),
  },
};

module.exports = {
  resolvers,
};
