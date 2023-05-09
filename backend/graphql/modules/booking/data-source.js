const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Booking } = require("../../../models/booking");

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

  async createBooking(booking) {
    return await this.model.create(booking);
  }
}

module.exports = {
  BookingSource,
};
