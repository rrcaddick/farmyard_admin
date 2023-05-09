const resolvers = {
  Query: {
    getPrice: (root, { priceId }, { dataSources: { priceSource } }) => priceSource.getPrice(priceId),
    getPrices: (root, args, { dataSources: { priceSource } }) => priceSource.getPrices(),
  },
  Price: {
    id: ({ _id }, args, context) => _id,
  },
};

module.exports = {
  resolvers,
};
