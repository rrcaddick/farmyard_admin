const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");

const priceModule = createModule({
  id: "price-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  priceModule,
};
