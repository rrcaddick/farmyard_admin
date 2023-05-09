const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getContact(contactId: ID): Contact
    getContacts: [Contact]!
  }

  type Mutation {
    createContact(input: createContactInput!, groupId: ID): Contact
  }

  type Contact {
    id: ID
    type: String!
    name: String!
    email: String
    tel: String
  }

  input createContactInput {
    type: String
    name: String!
    email: String
    tel: String
  }
`;

module.exports = {
  typeDefs,
};
