const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getPrice(priceId: ID): Price
    getPrices: [Price]!
  }

  type Price {
    id: ID
    type: String!
    amount: Int!
  }
`;

module.exports = {
  typeDefs,
};
