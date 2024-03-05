import { ApolloClient, ApolloLink, createHttpLink, from, InMemoryCache } from "@apollo/client";
import { createSafeFetch } from "@utils/fetch";
import { onError } from "@apollo/client/link/error";
import { persistCache, SessionStorageWrapper } from "apollo3-cache-persist";
import { removeRememberMe } from "@utils/auth";

// TODO: Refactor entity type policies into their respective folders
const createApolloClient = () => {
  let token;
  const cache = new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          readGroup: {
            read(_, { args: { groupId }, toReference }) {
              return toReference({
                __typename: "Group",
                id: groupId,
              });
            },
          },
          readGroups: {
            read(_, { args: { groupIds }, toReference, readField }) {
              if (!groupIds) return readField({ fieldName: "groups", args: {} });

              return groupIds.map((groupId) =>
                toReference({
                  __typename: "Group",
                  id: groupId,
                })
              );
            },
          },
          readContact: {
            read(_, { args: { contactId }, toReference, readField }) {
              return toReference({
                __typename: "Contact",
                id: contactId,
              });
            },
          },
          readContacts: {
            read(_, { args: { contactIds = [] }, toReference }) {
              return contactIds.map((contactId) =>
                toReference({
                  __typename: "Contact",
                  id: contactId,
                })
              );
            },
          },
          groupByContact: {
            read(_, { args: { contactId }, toReference, readField }) {
              const groups = readField({ fieldName: "groups", args: {} }) || [];

              const contact = toReference({
                __typename: "Contact",
                id: contactId,
              });

              for (let groupRef of groups) {
                const contacts = readField("contacts", groupRef);
                const hasContact = contacts?.some(({ __ref }) => __ref === contact.__ref);
                if (hasContact) {
                  return groupRef;
                }
              }
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

  const safeFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      ...(token && { "x-access-token": `Bearer ${token}` }),
    };

    const response = await window.fetch(url, {
      ...options,
      headers,
    });

    const accessToken = response.headers.get("x-access-token");

    if (accessToken) {
      setToken(accessToken);
    }

    return response;
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

    // Checks if token was refreshed with previous request
    return forward(operation).map((response) => {
      const context = operation.getContext();
      const {
        response: { headers },
      } = context;

      const accessToken = headers.get("x-access-token");

      if (accessToken) {
        setToken(accessToken);
      }

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
