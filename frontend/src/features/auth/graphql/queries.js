import { gql } from "@apollo/client";

const GET_ME = gql`
  query Me {
    me {
      id
      email
      name
      mobile
      position
      roles
    }
  }
`;

export { GET_ME };
