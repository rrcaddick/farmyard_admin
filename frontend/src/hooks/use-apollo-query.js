import { useQuery } from "@apollo/client";
import { extractServerError } from "@graphql/utils/extract-server-error";
import { useCallback, useMemo, useState } from "react";

const useApolloQuery = (query, onCompleted) => {
  const [serverErrors, setServerErrors] = useState({});

  const clearServerError = useCallback((name) => {
    setServerErrors((serverErrors) => (name ? { ...serverErrors, [name]: undefined } : {}));
  }, []);

  const { data, loading, error, refetch } = useQuery(query, {
    onError: (error) => {
      setServerErrors((serverErrors) => ({ ...serverErrors, ...extractServerError(error) }));
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      onCompleted && onCompleted();
      clearServerError();
    },
  });

  const queryData = useMemo(() => {
    const dataKeys = Object.keys(data ?? {});
    return dataKeys.length === 1 ? data[dataKeys[0]] : data;
  }, [data]);

  return { data: queryData, loading, error, serverErrors, refetch };
};

export { useApolloQuery };
