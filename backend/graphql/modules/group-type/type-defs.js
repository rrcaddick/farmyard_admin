const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getGroupType(groupTypeId: ID): GroupType
    getGroupTypes: [GroupType!]
  }

  type GroupType {
    id: ID
    type: String!
    price: Price!
  }

  input GroupTypeInput {
    id: ID
    type: String!
    price: ID
  }
`;

module.exports = {
  typeDefs,
};
