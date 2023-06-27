const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar RestoreInfo

  type DeleteResponse {
    ok: Boolean!
    deletedCount: Int
    deletedIds: [ID]
    restoreInfo: RestoreInfo
  }
`;

module.exports = {
  typeDefs,
};
