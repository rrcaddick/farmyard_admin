const resolvers = {
  Query: {
    getGroupType: (root, { groupTypeId }, { dataSources: { groupTypeSource } }) =>
      groupTypeSource.getGroupType(groupTypeId),
    getGroupTypes: (root, args, { dataSources: { groupTypeSource } }) => groupTypeSource.getGroupTypes(),
  },
};

module.exports = {
  resolvers,
};
