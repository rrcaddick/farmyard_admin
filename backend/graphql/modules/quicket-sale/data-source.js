const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { QuicketSale } = require("../../../models/quicket-sale");
const { quicketService } = require("../../../services/quicket");

class QuicketSource extends MongoDataSource {
  constructor() {
    super(QuicketSale);
  }

  async getQuicketSales(date) {
    return await this.model.find({ eventDate: date });
  }

  async getQuicketSale(orderNumber) {
    return await this.model.findOne({ orderNumbers: orderNumber });
  }
}

module.exports = { QuicketSource };
