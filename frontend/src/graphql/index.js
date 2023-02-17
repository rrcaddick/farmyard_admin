import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const createApolloClient = () => {
  let token;

  const cache = new InMemoryCache();

  const setToken = (newToken) => {
    token = newToken;
  };

  const httpLink = createHttpLink({
    uri: "/graphql",
  });

  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }) => ({
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    }));

    return forward(operation);
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {});

  const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache,
  });

  client.setToken = setToken;
  return client;
};

export { createApolloClient };
