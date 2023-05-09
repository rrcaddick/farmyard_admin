const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { GroupType } = require("../../../models/group-type");

class GroupTypeSource extends MongoDataSource {
  constructor() {
    super(GroupType);
  }

  async getGroupType(groupTypeId) {
    return await this.findOneById(groupTypeId).populate("price");
  }

  async getGroupTypes() {
    return await this.model.find().populate("price");
  }
}

module.exports = {
  GroupTypeSource,
};
