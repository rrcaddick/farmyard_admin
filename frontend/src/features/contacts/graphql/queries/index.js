const { gql } = require("@apollo/client");
const { FULL_CONTACT_FRAGMENT } = require("@contacts/graphql/fragments");

const GET_CONTACTS = gql`
  ${FULL_CONTACT_FRAGMENT}
  query getContacts($contactIds: [ID]) {
    contacts(contactIds: $contactIds) {
      ...FullContact
    }
  }
`;

const GET_CONTACT = gql`
  ${FULL_CONTACT_FRAGMENT}
  query getContact($contactId: ID) {
    contact(contactId: $contactId) {
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

const GET_CONTACT_TYPES = gql`
  query getContactTypes {
    contactTypes
  }
`;

const GET_CONTACT_FORM_OPTIONS = gql`
  query getContactFormOptions($groupIds: [ID]) {
    contactTypes
    groups(groupIds: $groupIds) {
      id
      name
      contacts
    }
  }
`;

export { GET_CONTACTS, GET_CONTACT, READ_CONTACT, READ_CONTACTS, GET_CONTACT_TYPES, GET_CONTACT_FORM_OPTIONS };
