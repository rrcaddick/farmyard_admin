const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");

const quicketSaleModule = createModule({
  id: "quicket-sale",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  quicketSaleModule,
};
