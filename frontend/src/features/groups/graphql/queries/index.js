import { gql } from "@apollo/client";
import { FULL_GROUP_FRAGMENT } from "@groups/graphql/fragments";

const GET_GROUPS = gql`
  ${FULL_GROUP_FRAGMENT}
  query GetGroups($groupIds: [ID]) {
    getGroups(groupIds: $groupIds) {
      ...FullGroup
    }
  }
`;

const READ_GROUPS = gql`
  ${FULL_GROUP_FRAGMENT}
  query ReadGroups($groupIds: [ID]) @client {
    readGroups(groupIds: $groupIds) {
      ...FullGroup
    }
  }
`;

const GET_GROUP = gql`
  ${FULL_GROUP_FRAGMENT}
  query getGroup($groupId: ID!) {
    getGroup(groupId: $groupId) {
      ...FullGroup
    }
  }
`;

const READ_GROUP = gql`
  ${FULL_GROUP_FRAGMENT}
  query readGroup($groupId: ID!) @client {
    readGroup(groupId: $groupId) {
      ...FullGroup
    }
  }
`;

const GET_ALL_GROUP_TYPES = gql`
  query GetAllGroupTypes {
    getGroupTypes {
      id
      type
      price {
        id
      }
    }
  }
`;

export { GET_GROUPS, READ_GROUPS, GET_GROUP, READ_GROUP, GET_ALL_GROUP_TYPES };
