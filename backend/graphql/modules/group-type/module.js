const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");

const groupTypeModule = createModule({
  id: "group-type-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  groupTypeModule,
};
