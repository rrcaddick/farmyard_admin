const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Price } = require("../../../models/price");

class PriceSource extends MongoDataSource {
  constructor() {
    super(Price);
  }

  async getPrice(priceId) {
    return await this.findOneById(priceId);
  }

  async getPrices() {
    return await this.model.find();
  }
}

module.exports = {
  PriceSource,
};
