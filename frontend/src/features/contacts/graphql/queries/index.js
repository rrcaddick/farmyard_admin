const { gql } = require("@apollo/client");
const { FULL_CONTACT_FRAGMENT } = require("@contacts/graphql/fragments");

const GET_ALL_CONTACTS = gql`
  ${FULL_CONTACT_FRAGMENT}
  query GetContacts {
    getContacts {
      ...FullContact
    }
  }
`;

const GET_CONTACT_BY_ID = gql`
  ${FULL_CONTACT_FRAGMENT}
  query GetContactById($contactId: ID) {
    getContact(contactId: $contactId) {
      ...FullContact
    }
  }
`;

export { GET_ALL_CONTACTS, GET_CONTACT_BY_ID };
