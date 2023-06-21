const resolvers = {
  Query: {
    getGroup: (root, { groupId }, { dataSources: { groupSource } }) => groupSource.getGroup(groupId),
    getGroups: (root, { groupIds }, { dataSources: { groupSource } }) => groupSource.getGroups(groupIds),
  },
  Mutation: {
    createGroup: (root, { input }, { dataSources: { groupSource } }) => groupSource.createGroup(input),
    updateGroup: (root, { input }, { dataSources: { groupSource } }) => groupSource.updateGroup(input),
    deleteGroups: (root, { groupIds }, { dataSources: { groupSource } }) => groupSource.deleteGroups(groupIds),
    restoreGroups: (root, { groupIds }, { dataSources: { groupSource } }) => groupSource.restoreGroups(groupIds),
  },
};

module.exports = {
  resolvers,
};
