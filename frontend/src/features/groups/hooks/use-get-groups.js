import { useQuery } from "@apollo/client";
import { extractServerError } from "@graphql/utils/extract-server-error";
import { GET_GROUPS } from "@groups/graphql/queries";
import { useCallback, useState } from "react";

const useGetGroups = (onCompleted) => {
  const [serverErrors, setServerErrors] = useState({});

  const clearServerError = useCallback((name) => {
    setServerErrors((serverErrors) => (name ? { ...serverErrors, [name]: undefined } : {}));
  }, []);

  const {
    data: { getGroups } = { getGroups: [] },
    loading,
    error,
    refetch,
  } = useQuery(GET_GROUPS, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      onCompleted && onCompleted();
      clearServerError();
    },
  });

  return { groups: getGroups, loading, error, serverErrors, refetch };
};

export { useGetGroups };
