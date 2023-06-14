import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from "@apollo/client";
import { createSafeFetch } from "@utils/fetch";
import { onError } from "@apollo/client/link/error";
import { persistCache, SessionStorageWrapper } from "apollo3-cache-persist";
import { removeRememberMe } from "@utils/auth";

const createApolloClient = () => {
  let token;
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getGroup: {
            read(_, { args: { groupId }, toReference }) {
              return toReference({
                __typename: "Group",
                id: groupId,
              });
            },
          },
          getContact: {
            read(_, { args: { contactId }, toReference }) {
              return toReference({
                __typename: "Contact",
                id: contactId,
              });
            },
          },
        },
      },
    },
  });

  (async () => {
    await persistCache({
      cache,
      storage: new SessionStorageWrapper(window.sessionStorage),
    });
  })();

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

  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    console.log(networkError);
  });

  const client = new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache,
  });

  client.setToken = setToken;
  client.getFetch = () => {
    return safeFetch;
  };

  client.clearPersistedCache = async () => {
    await client.clearStore();
    client.setToken = undefined;
    removeRememberMe();
    sessionStorage.removeItem("apollo-cache-persist");
  };

  return client;
};

export { createApolloClient };
