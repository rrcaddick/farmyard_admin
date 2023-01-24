const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");

const ikhokhaSaleModule = createModule({
  id: "ikhokha-sale",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  ikhokhaSaleModule,
};
