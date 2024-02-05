const resolvers = {
  Query: {
    group: (_, { groupId }, { dataSources: { groupSource } }) => groupSource.getGroup(groupId),
    groups: (_, { groupIds }, { dataSources: { groupSource } }) => groupSource.getGroups(groupIds),
    // TODO: Rerfactor so that group can take either filter or id
    // group: (_, { groupId, filter }, { dataSources: { groupSource } }) => groupSource.getGroup(groupId, filter),
  },
  Mutation: {
    createGroup: (_, { input }, { dataSources: { groupSource } }) => groupSource.createGroup(input),
    updateGroup: (_, { input, deletedContacts }, { dataSources: { groupSource } }) =>
      groupSource.updateGroup(input, deletedContacts),
    deleteGroups: (_, { groupIds }, { dataSources: { groupSource } }) => groupSource.deleteGroups(groupIds),
    restoreGroups: (_, { groupIds }, { dataSources: { groupSource } }) => groupSource.restoreGroups(groupIds),
  },
};

module.exports = {
  resolvers,
};
