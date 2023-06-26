const { gql } = require("@apollo/client");

const FULL_GROUP_FRAGMENT = gql`
  fragment FullGroup on Group {
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
      name
      email
      tel
    }
  }
`;

export { FULL_GROUP_FRAGMENT };
