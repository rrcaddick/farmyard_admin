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

const GET_GROUP = gql`
  ${FULL_GROUP_FRAGMENT}
  query getGroup($groupId: ID!) {
    getGroup(groupId: $groupId) {
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

export { GET_GROUPS, GET_ALL_GROUP_TYPES, GET_GROUP };
