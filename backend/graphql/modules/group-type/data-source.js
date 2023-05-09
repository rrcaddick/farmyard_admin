const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { GroupType } = require("../../../models/group-type");

class GroupTypeSource extends MongoDataSource {
  constructor() {
    super(GroupType);
  }

  async getGroupType(groupTypeId) {
    return this.executeWithGraphqlProjection(this.model.findById(groupTypeId));
  }

  async getGroupTypes() {
    return this.executeWithGraphqlProjection(this.model.find());
  }
}

module.exports = {
  GroupTypeSource,
};
