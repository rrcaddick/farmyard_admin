import { gql } from "@apollo/client";

const getMe = gql`
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

export { getMe };
