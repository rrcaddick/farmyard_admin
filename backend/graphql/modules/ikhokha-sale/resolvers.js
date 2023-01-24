const resolvers = {
  Query: {
    ikhokhaSales: (root, { date }, { dataSources: { ikhokhaSource } }) => ikhokhaSource.getDailySalesData(date),
  },
};

module.exports = {
  resolvers,
};
