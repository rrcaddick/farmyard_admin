const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Group } = require("../../../models/group");

class GroupSource extends MongoDataSource {
  constructor() {
    super(Group);
  }

  async getGroup(groupId) {
    return this.executeWithGraphqlProjection(this.model.findById(groupId));
  }

  async getGroups() {
    return this.executeWithGraphqlProjection(this.model.find());
  }

  async createGroup(group) {
    const newGroup = await this.model.create(group);
    return newGroup;
  }
}

module.exports = {
  GroupSource,
};
