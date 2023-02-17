import { useApolloClient } from "@apollo/client";

const useApolloCache = () => {
  const client = useApolloClient();

  const cache = {
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
  };

  return cache;
};

export { useApolloCache };
