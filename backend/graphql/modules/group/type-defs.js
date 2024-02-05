const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    group(groupId: ID!): Group
    groups(groupIds: [ID]): [Group]!
    # group(groupId: ID, filter: FilterInput): Group
  }

  input FilterInput {
    field: String
    value: String
  }

  type Mutation {
    createGroup(input: CreateGroupInput!): Group!
    updateGroup(input: UpdateGroupInput!, deletedContacts: [ID]): Group!
    deleteGroups(groupIds: [ID]!): DeleteResponse
    restoreGroups(groupIds: [ID]!): [Group]!
  }

  type Group {
    id: ID
    name: String!
    groupType: GroupType
    address: Address
    contacts: [Contact]
    # deletedContacts - Maybe
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
    type: String
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
    type: String
    groupId: ID
  }
`;

module.exports = {
  typeDefs,
};
