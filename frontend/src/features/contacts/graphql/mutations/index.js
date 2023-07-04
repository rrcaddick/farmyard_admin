import { gql } from "@apollo/client";
import { FULL_CONTACT_FRAGMENT } from "../fragments";

const CREATE_CONTACT = gql`
  ${FULL_CONTACT_FRAGMENT}
  mutation createContact($input: CreateContactInput!) {
    createContact(input: $input) {
      ...FullContact
    }
  }
`;

const UPDATE_CONTACT = gql`
  # TODO: Create function to dynamically create fragment based on dirty fields
  ${FULL_CONTACT_FRAGMENT}
  mutation updateContact($input: UpdateContactInput!) {
    updateContact(input: $input) {
      ...FullContact
    }
  }
`;

const DELETE_CONTACTS = gql`
  mutation deleteContacts($contactIds: [ID]!) {
    deleteContacts(contactIds: $contactIds) {
      ok
      deletedCount
      deletedIds
      restoreInfo
    }
  }
`;

const RESTORE_CONTACTS = gql`
  ${FULL_CONTACT_FRAGMENT}
  mutation restoreContacts($contactIds: [ID]!, $restoreInfo: RestoreInfo!) {
    restoreContacts(contactIds: $contactIds, restoreInfo: $restoreInfo) {
      ...FullContact
    }
  }
`;

export { CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACTS, RESTORE_CONTACTS };
