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
    createdBy: CreatedBy
    bookedBy: BookingContact
    group: BookingGroup
    visitors: Visitors
    price: BookingPrice
    comments: [Comment]!
    activity: [Activity]!
  }

  type CreatedBy {
    user: User
    name: String!
  }

  type BookingContact {
    contact: Contact
    name: String
  }

  type BookingGroup {
    id: ID
    name: String!
    groupType: BookingGroupType
    address: Address
  }

  type BookingGroupType {
    id: ID
    type: String
  }

  type Visitors {
    total: Int!
    adults: Int
    youth: Int
    kids: Int
    todlers: Int
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
    bookedBy: BookingContactInput
    status: String
    group: BookingGroupInput
    visitors: BookingVisitorsInput
    price: BookingPriceInput
    comments: [BookingCommentsInput]
    activity: [BookingActivityInput]
  }

  input BookingContactInput {
    contact: ID
    name: String
  }

  input BookingGroupInput {
    id: ID
    name: String
    groupType: BookingGroupTypeInput
    address: AddressInput
  }

  input BookingGroupTypeInput {
    id: ID
    type: String
  }

  input BookingVisitorsInput {
    total: Int
    adults: Int
    youth: Int
    kids: Int
    todlers: Int
  }

  input BookingPriceInput {
    id: ID
    type: String
    amount: Int
    total: Int
  }

  input BookingCommentsInput {
    comment: String
  }

  input BookingActivityInput {
    action: String
  }
`;

module.exports = {
  typeDefs,
};
