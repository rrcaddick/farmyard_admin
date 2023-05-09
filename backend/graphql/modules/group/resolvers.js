const resolvers = {
  Query: {
    getGroup: (root, { groupId }, { dataSources: { groupSource } }) => groupSource.getGroup(groupId),
    getGroups: (root, args, { dataSources: { groupSource } }) => groupSource.getGroups(),
  },
  Mutation: {
    createGroup: (root, { input }, { dataSources: { groupSource } }) => groupSource.createGroup(input),
  },
};

module.exports = {
  resolvers,
};
