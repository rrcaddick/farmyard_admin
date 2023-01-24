const { MongoDataSource } = require("apollo-datasource-mongodb");
const { IkhokhaSale } = require("../../../models/ikhokha-sale");
const { ikhokhaService } = require("../../../services/ikhokha");

class IkhokhaSource extends MongoDataSource {
  constructor() {
    super(IkhokhaSale);
  }

  async getDailySalesData(date) {
    return await ikhokhaService.getDailyData(date);
  }
}

module.exports = {
  IkhokhaSource,
};
