const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    quicketSales(date: String): [QuicketSale]!
    quicketSale(orderNumber: Int): QuicketSale
  }

  type QuicketSale {
    id: ID
    orderNumbers: [Int]
    eventDate: String
    purchaserEmail: String
    visitors: String
    hires: [String]
  }
`;

module.exports = {
  typeDefs,
};
