const resolvers = {
  Query: {
    getBooking: (root, { bookingId }, { dataSources: { bookingSource } }) => bookingSource.getBooking(priceId),
    getBookings: (root, args, { dataSources: { bookingSource } }) => bookingSource.getBookings(),
  },
  Mutation: {
    createBooking: (root, { input }, { userId, dataSources: { bookingSource } }) =>
      bookingSource.createBooking(input, userId),
  },
};

module.exports = {
  resolvers,
};
