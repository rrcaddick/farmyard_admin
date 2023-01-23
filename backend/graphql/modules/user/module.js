const { createModule } = require("graphql-modules");
const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");

const userModule = createModule({
  id: "user-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  userModule,
};
