const { gql } = require("@apollo/client");

const FULL_CONTACT_FRAGMENT = gql`
  fragment FullContact on Contact {
    id
    type
    name
    email
    tel
    groupId
  }
`;

export { FULL_CONTACT_FRAGMENT };
