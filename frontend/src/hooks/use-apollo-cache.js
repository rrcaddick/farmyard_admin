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
      read: (query, variables = null) => {
        const data = client.readQuery({
          query,
          variables,
        });
        return data ? Object.values(data)[0] : null;
      },
      readFragment: (typeName, id, fragment) => {
        const data = client.readFragment({
          id: `${typeName}:${id}`,
          fragment: fragment,
        });

        return data ? data : null;
      },
    }),
    [client]
  );

  return cache;
};

export { useApolloCache };
