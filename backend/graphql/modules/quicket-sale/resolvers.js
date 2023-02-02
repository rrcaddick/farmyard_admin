const resolvers = {
  Query: {
    quicketSales: (root, { date }, { dataSources: { quicketSource } }) => quicketSource.getQuicketSales(date),
    quicketSale: (root, { orderNumber }, { dataSources: { quicketSource } }) =>
      quicketSource.getQuicketSale(orderNumber),
  },
};

module.exports = {
  resolvers,
};
