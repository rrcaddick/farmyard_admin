const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");

const groupModule = createModule({
  id: "group-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  groupModule,
};
