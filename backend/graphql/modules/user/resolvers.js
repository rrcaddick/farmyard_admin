const resolvers = {
  Query: {
    me: () => ({ id: 1, name: "Ray Caddick", email: "rrcaddick@gmail.com" }),
  },
};

module.exports = {
  resolvers,
};
