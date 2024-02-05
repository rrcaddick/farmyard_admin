const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    ikhokhaSales(date: String): [ikhokhaSale!]!
    ikhokhaSaleSundayTim: [ikhokhaSale!]!
  }

  type ikhokhaSale {
    id: ID
    date: String
    ref: String
    employee: String
    paymentType: String
    amount: Int
    saleType: String
    saleDesc: String
    quantity: Int
  }
`;

module.exports = {
  typeDefs,
};
