const { MongoDataSource } = require("apollo-datasource-mongodb");
const { User } = require("../../../models/user");

class UserSource extends MongoDataSource {
  constructor() {
    super(User);
  }

  async getMe(userId) {
    return await this.findOneById(userId);
  }
}

module.exports = {
  UserSource,
};
