import { useApolloClient } from "@apollo/client";
import { useMemo } from "react";

const useApolloCache = () => {
  const client = useApolloClient();

  const cache = useMemo(
    () => ({
      write: (query, typename, data, variables = null) => {
        client.writeQuery({
          query,
          data: {
            me: {
              __typename: typename,
              ...data,
            },
          },
          ...(variables && variables),
        });
      },
      read: (query, variables) => {
        const data = client.readQuery({
          query,
          ...(variables && variables),
        });
        return data ? Object.values(data)[0] : null;
      },
    }),
    [client]
  );

  return cache;
};

export { useApolloCache };
