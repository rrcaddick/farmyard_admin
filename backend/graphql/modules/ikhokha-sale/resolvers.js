const resolvers = {
  Query: {
    ikhokhaSales: (root, { date }, { dataSources: { ikhokhaSource } }) => ikhokhaSource.getDailySalesData(date),
    ikhokhaSaleSundayTim: (root, args, { dataSources: { ikhokhaSource } }) => ikhokhaSource.getikhokhaSaleSundayTim(),
  },
};

module.exports = {
  resolvers,
};
