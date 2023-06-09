import { useCallback, useMemo, useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_ALL_GROUPS, GET_GROUP_BY_ID } from "../graphql/queries";
import { CREATE_GROUP_MUTATION, DELETE_GROUPS_MUTATION } from "../graphql/mutations";

const extractServerError = ({ graphQLErrors, networkError }) => {
  let errors = {};
  let networkErrors = {};

  if (graphQLErrors?.length > 0) {
    const { data } = graphQLErrors[0]?.extensions || {};
    errors = data;
  }

  if (networkError) {
    networkErrors = { network: "Something went wrong. Please try again or contact the system administrator" };
  }

  return { ...errors, ...networkErrors };
};

const useGroup = ({ onCreateComplete, onUpdateComplete, onDeleteComplete } = {}) => {
  const [serverErrors, setServerErrors] = useState({});
  const clearServerError = useCallback((name) => {
    setServerErrors((serverErrors) => ({ ...serverErrors, [name]: undefined }));
  }, []);

  const [_createGroup, { loading: createLoading }] = useMutation(CREATE_GROUP_MUTATION, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onCreateComplete && onCreateComplete(data);
    },
    update: (cache, { data }) => {
      const { createGroup } = data;
      cache.updateQuery({ query: GET_ALL_GROUPS }, ({ getGroups }) => ({ getGroups: [...getGroups, createGroup] }));
    },
  });

  const [_updateGroup, { loading: updateLoading }] = useMutation(CREATE_GROUP_MUTATION, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onUpdateComplete && onUpdateComplete(data);
    },
    update: (cache, { data }) => {
      const { updateGroup } = data;
      cache.updateQuery({ query: GET_GROUP_BY_ID, variables: { groupId: updateGroup.id } }, () => updateGroup);
    },
  });

  const [_deleteGroups, { loading: deleteLoading }] = useMutation(DELETE_GROUPS_MUTATION, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    onCompleted: (data) => {
      onDeleteComplete && onDeleteComplete(data);
    },
    update: (cache, { data }) => {
      const { updateGroup } = data;
      cache.updateQuery({ query: GET_GROUP_BY_ID, variables: { groupId: updateGroup.id } }, () => updateGroup);
    },
  });

  const createGroup = useCallback(
    (args) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, network: undefined }));
      _createGroup(args);
    },
    [_createGroup]
  );

  const updateGroup = useCallback(
    (args) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, network: undefined }));
      _updateGroup(args);
    },
    [_updateGroup]
  );

  const deleteGroups = useCallback(
    (args) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, network: undefined }));
      _deleteGroups(args);
    },
    [_deleteGroups]
  );

  const loading = useMemo(() => {
    return createLoading || updateLoading || deleteLoading;
  }, [createLoading, updateLoading, deleteLoading]);

  return {
    createGroup,
    updateGroup,
    deleteGroups,
    loading,
    serverErrors,
    clearServerError,
  };
};

export default useGroup;
