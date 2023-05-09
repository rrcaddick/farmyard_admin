const resolvers = {
  Query: {
    me: (root, args, { userId, dataSources: { userSource } }) => userSource.getMe(userId),
  },
  User: {
    id: ({ _id }, args, context) => _id,
  },
};

module.exports = {
  resolvers,
};
