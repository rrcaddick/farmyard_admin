const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Contact } = require("../../../models/contact");

class ContactSource extends MongoDataSource {
  constructor() {
    super(Contact);
  }

  async getContact(contactId) {
    return await this.findOneById(contactId);
  }

  async getContacts() {
    return await this.model.find();
  }

  async createContact(newContact, groupId = null) {
    const [contact] = await this.model.create([newContact], { groupId });
    return contact;
  }
}

module.exports = {
  ContactSource,
};
