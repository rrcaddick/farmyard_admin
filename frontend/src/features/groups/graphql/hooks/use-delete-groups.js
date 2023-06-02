import { createMutation } from "@graphql/utils/create-mutation";
import { DELETE_GROUPS_MUTATION } from "@groups/graphql/mutations";
import { GET_ALL_GROUPS } from "@groups/graphql/queries";

const useDeleteGroups = createMutation(DELETE_GROUPS_MUTATION, (cache, { data }) => {
  const {
    deleteGroups: { deletedIds },
  } = data;
  cache.updateQuery({ query: GET_ALL_GROUPS }, ({ getGroups }) => ({
    getGroups: getGroups.filter((group) => !deletedIds.includes(group.id)),
  }));
});

export { useDeleteGroups };
