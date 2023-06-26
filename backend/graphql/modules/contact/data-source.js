const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Contact } = require("../../../models/contact");

class ContactSource extends MongoDataSource {
  constructor() {
    super(Contact);
  }

  async getContact(contactId) {
    return await this.findOneById(contactId);
  }

  async getContacts(contactIds) {
    return this.executeWithGraphqlProjection(
      this.model.find({
        ...(contactIds && { _id: contactIds }),
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      })
    );
  }

  async createContact(newContact, groupId = null) {
    const [contact] = await this.model.create([newContact], { groupId });
    return this.executeWithGraphqlProjection(contact);
  }
}

module.exports = {
  ContactSource,
};
