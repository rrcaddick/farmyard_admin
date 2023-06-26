import { useQuery } from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import { extractServerError } from "@graphql/utils/extract-server-error";
import { useCallback, useState } from "react";

const useApolloQuery = (query, onCompleted) => {
  const [serverErrors, setServerErrors] = useState({});

  const clearServerError = useCallback((name) => {
    setServerErrors((serverErrors) => (name ? { ...serverErrors, [name]: undefined } : {}));
  }, []);

  const {
    data: { [getOperationName(query)]: extractedData } = { [getOperationName(query)]: [] },
    loading,
    error,
    refetch,
  } = useQuery(query, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      onCompleted && onCompleted();
      clearServerError();
    },
  });

  return { data: extractedData, loading, error, serverErrors, refetch };
};

export { useApolloQuery };
