import { gql } from "@apollo/client";

const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($input: CreateGroupInput) {
    createGroup(input: $input) {
      id
      name
      groupType {
        id
        type
        price {
          id
        }
      }
      address {
        street
        suburb
        postCode
      }
      contacts {
        id
      }
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

export { CREATE_GROUP_MUTATION, DELETE_GROUPS_MUTATION };
