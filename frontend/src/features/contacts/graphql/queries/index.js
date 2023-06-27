const { gql } = require("@apollo/client");
const { FULL_CONTACT_FRAGMENT } = require("@contacts/graphql/fragments");

const GET_CONTACTS = gql`
  ${FULL_CONTACT_FRAGMENT}
  query getContacts($contactIds: [ID]) {
    getContacts(contactIds: $contactIds) {
      ...FullContact
    }
  }
`;

const GET_CONTACT = gql`
  ${FULL_CONTACT_FRAGMENT}
  query getContact($contactId: ID) {
    getContact(contactId: $contactId) {
      ...FullContact
    }
  }
`;

const READ_CONTACTS = gql`
  ${FULL_CONTACT_FRAGMENT}
  query readContacts($contactIds: [ID]) @client {
    readContacts(contactIds: $contactIds) {
      ...FullContact
    }
  }
`;

const READ_CONTACT = gql`
  ${FULL_CONTACT_FRAGMENT}
  query readContact($contactId: ID) @client {
    readContact(contactId: $contactId) {
      ...FullContact
    }
  }
`;

export { GET_CONTACTS, GET_CONTACT, READ_CONTACT, READ_CONTACTS };
