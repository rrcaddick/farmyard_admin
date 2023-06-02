const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Group } = require("../../../models/group");
const { Contact } = require("../../../models/contact");

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

  async createGroup(input) {
    const { contacts, ...group } = input;

    const hasContacts = !!contacts?.length > 0;
    const contactIds = hasContacts ? (await Contact.insertMany(contacts)).map(({ _id }) => _id) : null;

    try {
      return this.executeWithGraphqlProjection(
        await this.model.create({ ...group, ...(hasContacts && { contacts: contactIds }) })
      );
    } catch (error) {
      await Contact.deleteMany({ _id: contactIds });
      throw error;
    }
  }

  async deleteGroups(groupIds) {
    const { acknowledged: ok, deletedCount } = await this.model.deleteMany({ _id: groupIds });
    return { ok, deletedCount, deletedIds: groupIds };
  }
}

module.exports = {
  GroupSource,
};
