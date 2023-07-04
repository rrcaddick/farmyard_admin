const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    contact(contactId: ID!): Contact
    contacts(contactIds: [ID]): [Contact]!
    contactTypes: [String]!
  }

  type Mutation {
    createContact(input: CreateContactInput!): Contact
    updateContact(input: UpdateContactInput!): Contact!
    deleteContacts(contactIds: [ID]!): DeleteResponse
    restoreContacts(contactIds: [ID]!, restoreInfo: RestoreInfo!): [Contact]!
  }

  type Contact {
    id: ID!
    type: String
    name: String!
    email: String
    tel: String
    groupId: ID
  }

  input CreateContactInput {
    type: String
    name: String!
    email: String
    tel: String
    groupId: ID
  }

  input UpdateContactInput {
    id: ID
    type: String
    name: String
    email: String
    tel: String
    groupId: ID
  }
`;

module.exports = {
  typeDefs,
};
