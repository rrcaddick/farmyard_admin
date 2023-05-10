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

  async createBooking(input, userId) {
    const booking = await this.addCreatedBy(input, userId);
    const { createdBy } = booking;

    booking.comments.forEach((comment) => {
      this.addCreatedBy(comment, userId, createdBy);
    });

    booking.activity.forEach((action) => {
      this.addCreatedBy(action, userId, createdBy);
    });

    return await this.model.create(booking);
  }
}

module.exports = {
  BookingSource,
};
