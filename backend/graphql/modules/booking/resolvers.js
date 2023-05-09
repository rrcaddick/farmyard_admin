const resolvers = {
  Query: {
    getBooking: (root, { bookingId }, { dataSources: { bookingSource } }) => bookingSource.getBooking(priceId),
    getBookings: (root, args, { dataSources: { bookingSource } }) => bookingSource.getBookings(),
  },
  Mutation: {
    createBooking: (root, { input }, { dataSources: { bookingSource } }) => bookingSource.createBooking(input),
  },
};

module.exports = {
  resolvers,
};
