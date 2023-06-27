const { GraphQLJSON } = require("graphql-type-json");

const resolvers = {
  RestoreInfo: GraphQLJSON,
};

module.exports = {
  resolvers,
};
