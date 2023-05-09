const { AuthenticationError } = require("apollo-server-express");

const authGaurd = ({ root, args, context: { userId } }, next) => {
  if (!userId) throw new AuthenticationError("Invalid token");
  return next();
};

module.exports = {
  authGaurd,
};
