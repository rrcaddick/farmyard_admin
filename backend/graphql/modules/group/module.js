const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");
const { middlewares } = require("./middlewares");

const groupModule = createModule({
  id: "group-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
  middlewares,
});

module.exports = {
  groupModule,
};
