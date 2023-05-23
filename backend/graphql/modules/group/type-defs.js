const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getGroup(groupId: ID): Group
    getGroups: [Group]!
  }

  type Mutation {
    createGroup(input: CreateGroupInput): Group!
  }

  type Group {
    id: ID
    name: String!
    groupType: GroupType
    address: Address
    contacts: [Contact]
  }

  type Address {
    street: String
    suburb: String
    postCode: Int
  }

  input CreateGroupInput {
    name: String
    groupType: GroupTypeInput
    address: AddressInput
    contacts: [GroupContactInput]
  }

  input AddressInput {
    street: String
    suburb: String
    postCode: Int
  }

  input GroupContactInput {
    name: String!
    email: String
    tel: String
  }
`;

module.exports = {
  typeDefs,
};
