import { gql } from "@apollo/client";
import { FULL_GROUP_FRAGMENT } from "../fragments";

const CREATE_GROUP_MUTATION = gql`
  ${FULL_GROUP_FRAGMENT}
  mutation CreateGroup($input: CreateGroupInput) {
    createGroup(input: $input) {
      ...FullGroup
    }
  }
`;

const UPDATE_GROUP_MUTATION = gql`
  # TODO: Create function to dynamically create fragment based on dirty fields
  ${FULL_GROUP_FRAGMENT}
  mutation UpdateGroup($input: UpdateGroupInput) {
    updateGroup(input: $input) {
      ...FullGroup
    }
  }
`;

const DELETE_GROUPS_MUTATION = gql`
  mutation DeleteGroups($groupIds: [ID]) {
    deleteGroups(groupIds: $groupIds) {
      ok
      deletedCount
      deletedIds
    }
  }
`;

const RESTORE_GROUPS_MUTATION = gql`
  ${FULL_GROUP_FRAGMENT}
  mutation RestoreGroups($groupIds: [ID]) {
    restoreGroups(groupIds: $groupIds) {
      ...FullGroup
    }
  }
`;

export { CREATE_GROUP_MUTATION, UPDATE_GROUP_MUTATION, DELETE_GROUPS_MUTATION, RESTORE_GROUPS_MUTATION };
