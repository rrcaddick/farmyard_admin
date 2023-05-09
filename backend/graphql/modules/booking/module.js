const { createModule } = require("graphql-modules");
const { typeDefs } = require("./type-defs");
const { resolvers } = require("./resolvers");

const bookingModule = createModule({
  id: "booking-module",
  dirname: __dirname,
  typeDefs,
  resolvers,
});

module.exports = {
  bookingModule,
};
