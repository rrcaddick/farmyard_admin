import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from "@apollo/client";
import { createSafeFetch } from "@utils/fetch";
import { onError } from "@apollo/client/link/error";

const createApolloClient = () => {
  let token;
  const cache = new InMemoryCache();

  const setToken = (newToken) => {
    token = newToken;
  };

  // Stops fetch overriding to expose token
  const safeFetch = createSafeFetch(setToken);

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

    // Checks if token was refreshed with previous request
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const {
        response: { headers },
      } = context;

      const accessToken = headers.get("x-access-token");

      if (accessToken) setToken(accessToken);

      return response;
    });
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {});

  const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache,
  });

  client.setToken = setToken;
  client.getFetch = () => {
    return safeFetch;
  };

  return client;
};

export { createApolloClient };