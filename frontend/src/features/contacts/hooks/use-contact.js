import { useCallback, useMemo, useState } from "react";
import { gql, useApolloClient, useLazyQuery, useMutation } from "@apollo/client";
import { GET_CONTACT, GET_CONTACTS, READ_CONTACT } from "@contacts/graphql/queries";
import { CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACTS, RESTORE_CONTACTS } from "@contacts/graphql/mutations";
import { extractServerError } from "@graphql/utils/extract-server-error";
import { READ_GROUP, READ_GROUP_BY_CONTACT } from "@groups/graphql/queries";

const useContact = ({
  onCreateComplete,
  onReadComplete,
  onUpdateComplete,
  onDeleteComplete,
  onRestoreComplete,
} = {}) => {
  const [serverErrors, setServerErrors] = useState({});
  const clearServerError = useCallback((name) => {
    setServerErrors((serverErrors) => (name ? { ...serverErrors, [name]: undefined } : {}));
  }, []);

  const [_createContact, { loading: createLoading }] = useMutation(CREATE_CONTACT, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onCreateComplete && onCreateComplete(data);
    },
    update: (cache, { data }) => {
      const { createContact } = data;
      cache.updateQuery({ query: GET_CONTACTS }, ({ contacts }) => ({
        contacts: [...contacts, createContact],
      }));
    },
  });

  const [_getContacts, { loading: readLoading }] = useLazyQuery(GET_CONTACTS, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onReadComplete && onReadComplete(data);
    },
  });

  const [_updateContact, { loading: updateLoading }] = useMutation(UPDATE_CONTACT, {
    // Disables auto-update of single entites
    fetchPolicy: "no-cache",
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onUpdateComplete && onUpdateComplete(data);
    },
    update: (cache, { data }) => {
      const { updateContact } = data;

      const { id: contactId, groupId } = updateContact;

      // Update contact
      const { readContact: contact } =
        cache.readQuery({
          query: READ_CONTACT,
          variables: { contactId },
        }) || {};

      cache.writeQuery({
        query: GET_CONTACT,
        data: {
          contact: {
            ...updateContact,
          },
        },
        variables: {
          id: contactId,
        },
      });

      if (contact?.groupId !== groupId) {
        // Remove contact from previous group
        const { groupByContact: previousGroup } =
          cache.readQuery({
            query: READ_GROUP_BY_CONTACT,
            variables: { contactId },
          }) || {};

        cache.modify({
          id: cache.identify(previousGroup),
          fields: {
            contacts(contacts, { readField }) {
              return contacts.filter((contact) => readField("id", contact) !== contactId);
            },
          },
          broadcast: true,
        });

        // Add contact to new group
        const { readGroup: newGroup } = cache.readQuery({
          query: READ_GROUP,
          variables: { groupId },
        });

        cache.modify({
          id: cache.identify(newGroup),
          fields: {
            contacts(contacts, { readField, toReference }) {
              const newContact = toReference({
                __typename: "Contact",
                id: contactId,
              });
              return [...contacts, newContact];
            },
          },
          broadcast: true,
        });
      }
    },
  });

  const [_deleteContacts, { loading: deleteLoading }] = useMutation(DELETE_CONTACTS, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onDeleteComplete && onDeleteComplete(data);
    },
    update: (cache, { data }) => {
      const {
        deleteContacts: { deletedIds, ok },
      } = data;

      ok &&
        cache.updateQuery({ query: GET_CONTACTS }, ({ contacts }) => ({
          contacts: contacts.filter((contact) => !deletedIds.includes(contact.id)),
        }));
    },
  });

  const [_restoreContacts, { loading: restoreLoading }] = useMutation(RESTORE_CONTACTS, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onRestoreComplete && onRestoreComplete(data);
    },
    update: (cache, { data }) => {
      const { restoreContacts } = data;
      cache.updateQuery({ query: GET_CONTACTS }, ({ contacts }) => ({
        contacts: [...contacts, ...restoreContacts].sort((a, b) => a.id.toString() - b.id.toString()),
      }));
    },
  });

  const createContact = useCallback(
    (args) => {
      clearServerError();
      _createContact(args);
    },
    [_createContact, clearServerError]
  );

  const getContacts = async () => {
    const {
      data: { contacts },
    } = await _getContacts();
    return contacts;
  };

  const updateContact = useCallback(
    (args) => {
      clearServerError();
      _updateContact(args);
    },
    [_updateContact, clearServerError]
  );

  const deleteContacts = useCallback(
    async (args) => {
      clearServerError();
      const {
        data: { deleteContacts },
      } = await _deleteContacts(args);
      return deleteContacts;
    },
    [_deleteContacts, clearServerError]
  );

  const restoreContacts = useCallback(
    (args) => {
      clearServerError();
      _restoreContacts(args);
    },
    [_restoreContacts, clearServerError]
  );

  const loading = useMemo(() => {
    return createLoading || readLoading || updateLoading || deleteLoading || restoreLoading;
  }, [createLoading, readLoading, updateLoading, deleteLoading, restoreLoading]);

  return {
    createContact,
    getContacts,
    updateContact,
    deleteContacts,
    restoreContacts,
    loading,
    serverErrors,
    clearServerError,
  };
};

export { useContact };
