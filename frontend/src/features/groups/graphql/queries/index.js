import { gql } from "@apollo/client";
import { FULL_GROUP_FRAGMENT } from "@groups/graphql/fragments";

const GET_ALL_GROUPS = gql`
  ${FULL_GROUP_FRAGMENT}
  query GetGroups {
    getGroups {
      ...FullGroup
    }
  }
`;

const GET_GROUP_BY_ID = gql`
  ${FULL_GROUP_FRAGMENT}
  query getGroups($groupId: ID) {
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

export { GET_ALL_GROUPS, GET_ALL_GROUP_TYPES, GET_GROUP_BY_ID };
