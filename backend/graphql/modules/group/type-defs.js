const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getGroup(groupId: ID): Group
    getGroups: [Group]!
  }

  type Mutation {
    createGroup(input: CreateGroupInput): Group!
    updateGroup(input: UpdateGroupInput): Group!
    deleteGroups(groupIds: [ID]): DeleteResponse
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

  type DeleteResponse {
    ok: Boolean!
    deletedCount: Int
    deletedIds: [ID]
  }

  input CreateGroupInput {
    name: String!
    groupType: GroupTypeInput!
    address: AddressInput
    contacts: [GroupContactInput]
  }

  input UpdateGroupInput {
    id: ID!
    name: String
    groupType: GroupTypeInput
    address: AddressInput
    contacts: [UpdateGroupContactInput]
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

  input UpdateGroupContactInput {
    id: ID
    name: String
    email: String
    tel: String
    shouldDelete: Boolean
  }
`;

module.exports = {
  typeDefs,
};
