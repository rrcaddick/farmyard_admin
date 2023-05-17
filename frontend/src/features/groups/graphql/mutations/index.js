import { gql } from "@apollo/client";

const CREATE_GROUP_MUTATION = gql`
  mutation Mutation($input: CreateGroupInput) {
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
    }
  }
`;

export { CREATE_GROUP_MUTATION };
