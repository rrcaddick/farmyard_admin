const { gql } = require("@apollo/client");

const FULL_CONTACT_FRAGMENT = gql`
  fragment FullContact on Contact {
    id
    type
    name
    email
    tel
  }
`;

export { FULL_CONTACT_FRAGMENT };
