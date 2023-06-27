const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");

const globalModule = createModule({
  id: "global-module",
  dirname: __dirname,
  typeDefs,
});

module.exports = {
  globalModule,
};
