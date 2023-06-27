const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getContact(contactId: ID!): Contact
    getContacts(contactIds: [ID]): [Contact]!
  }

  type Mutation {
    createContact(input: CreateContactInput!, groupId: ID): Contact
    updateContact(input: UpdateContactInput!): Contact!
    deleteContacts(contactIds: [ID]!): DeleteResponse
    restoreContacts(contactIds: [ID]!, restoreInfo: RestoreInfo!): [Contact]!
  }

  type Contact {
    id: ID
    type: String!
    name: String!
    email: String
    tel: String
  }

  input CreateContactInput {
    type: String
    name: String!
    email: String
    tel: String
  }

  input UpdateContactInput {
    type: String
    name: String
    email: String
    tel: String
  }
`;

module.exports = {
  typeDefs,
};
