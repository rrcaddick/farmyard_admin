const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Booking } = require("../../../models/booking");
const { User } = require("../../../models/user");

class BookingSource extends MongoDataSource {
  constructor() {
    super(Booking);
  }

  async getBooking(bookingId) {
    return await this.findOneById(groupId);
  }

  async getBookings() {
    return await this.model.find();
  }

  async createBooking(input, userId) {
    const { name } = await User.findById(userId);

    const booking = { createdBy: { user: userId, name }, ...input };

    booking.activity[0].actionedBy = { user: userId, name };

    return await this.model.create(booking);
  }
}

module.exports = {
  BookingSource,
};
