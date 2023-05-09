const addInfoToContext = ({ root, args, context: { dataSources }, info }, next) => {
  dataSources.resolverInfo = info;
  return next();
};

module.exports = {
  addInfoToContext,
};
