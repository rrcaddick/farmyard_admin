import { createMutation } from "@graphql/utils/create-mutation";
import { CREATE_GROUP_MUTATION } from "@groups/graphql/mutations";
import { GET_ALL_GROUPS } from "@groups/graphql/queries";

const useCreateGroup = createMutation(CREATE_GROUP_MUTATION, (cache, { data }) => {
  const { createGroup } = data;
  cache.updateQuery({ query: GET_ALL_GROUPS }, ({ getGroups }) => ({ getGroups: [...getGroups, createGroup] }));
});

export { useCreateGroup };
