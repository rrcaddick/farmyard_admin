const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getBooking(bookingId: ID): Booking
    getBookings: [Booking]!
  }

  type Mutation {
    createBooking(input: CreateBookingInput): Booking!
  }

  type Booking {
    id: ID
    date: Int!
    createdBy: CreateBy!
    bookedBy: Contact!
    group: Group
    visitors: Visitors
    price: BookingPrice
    comments: [Comment]!
    activity: [Activity]!
  }

  type CreateBy {
    id: ID
    name: String!
  }

  type Visitors {
    total: Number!
    adults: Number
    youth: Number
    kids: Number
    todlers: Number
  }

  type BookingPrice {
    id: ID
    type: String
    amount: Int
    total: Int
  }

  type Comment {
    createdAt: Int
    comment: String
    user: User
  }

  type Activity {
    createdAt: Int
    action: String
    user: User
  }

  input CreateBookingInput {
    date: Int
    createdBy: User
    bookedBy: Contact
    group
  }
`;

module.exports = {
  typeDefs,
};
