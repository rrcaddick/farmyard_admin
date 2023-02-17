const resolvers = {
  Query: {
    me: (root, args, { userId, dataSources: { userSource } }) => userSource.getMe(userId),
  },
};

module.exports = {
  resolvers,
};
