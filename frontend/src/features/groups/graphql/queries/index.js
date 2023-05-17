import { gql } from "@apollo/client";

const GET_ALL_GROUPS = gql`
  query GetGroups {
    getGroups {
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

const GET_ALL_GROUP_TYPES = gql`
  query GetAllGroupTypes {
    getGroupTypes {
      id
      type
      price {
        id
        type
        amount
      }
    }
  }
`;

export { GET_ALL_GROUPS, GET_ALL_GROUP_TYPES };
