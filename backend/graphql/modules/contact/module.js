const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");
const { middlewares } = require("./middlewares");

const contactModule = createModule({
  id: "contact-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
  middlewares,
});

module.exports = {
  contactModule,
};
