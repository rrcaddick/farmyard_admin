const { UserInputError } = require("apollo-server-express");

const throwUniqueGrpahqlError = (error, uniqueErrors) => {
  const { keyValue } = error;
  const data = Object.fromEntries(Object.keys(keyValue).map((key) => [key, uniqueErrors[key]]));
  throw new UserInputError("Validation Failed", { data });
};

module.exports = {
  throwUniqueGrpahqlError,
};
