import { createMutation } from "@graphql/utils/create-mutation";
import { UPDATE_GROUP_MUTATION } from "@groups/graphql/mutations";
import { GET_GROUP_BY_ID } from "@groups/graphql/queries";

const useUpdateGroup = createMutation(UPDATE_GROUP_MUTATION, (cache, { data }) => {
  const { updateGroup } = data;
  cache.updateQuery({ query: GET_GROUP_BY_ID, variables: { groupId: updateGroup.id } }, ({ getGroup }) => updateGroup);
});

export { useUpdateGroup };
