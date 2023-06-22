import { useQuery } from "@apollo/client";
import { GET_ALL_GROUP_TYPES } from "../graphql/queries";
import { extractServerError } from "@graphql/utils/extract-server-error";
import { useCallback, useState } from "react";

const useGetAllGroupTypes = (onCompleted) => {
  const [serverErrors, setServerErrors] = useState({});

  const clearServerError = useCallback((name) => {
    setServerErrors((serverErrors) => (name ? { ...serverErrors, [name]: undefined } : {}));
  }, []);

  const {
    data: { getGroupTypes } = { getGroupTypes: [] },
    loading,
    error,
    refetch,
  } = useQuery(GET_ALL_GROUP_TYPES, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      onCompleted && onCompleted();
      clearServerError();
    },
  });

  return { groupTypes: getGroupTypes, loading, error, serverErrors, refetch };
};

export { useGetAllGroupTypes };
