const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Group } = require("../../../models/group");
const { Contact } = require("../../../models/contact");

class GroupSource extends MongoDataSource {
  constructor() {
    super(Group);
  }

  async getGroup(groupId) {
    return this.executeWithGraphqlProjection(
      this.model.find({ _id: groupId, $or: [{ deleted: { $exists: false } }, { deleted: false }] })
    );
  }

  async getGroups() {
    return this.executeWithGraphqlProjection(
      this.model.find({ $or: [{ deleted: { $exists: false } }, { deleted: false }] })
    );
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

  async updateGroup(input) {
    const { id, contacts, address, ...updateFields } = input;
    const newContactIds = [];

    if (contacts && contacts.length > 0) {
      for (let contact of contacts) {
        const { id, shouldDelete } = contact;
        // Contact to delete
        if (id && shouldDelete) {
          // Delete contact
          await Contact.findByIdAndDelete(id);
          // Remove id from array
          await this.model.findByIdAndUpdate(id, { $pull: { contacts: id } }, { new: true });
        }

        // Existing contact to update
        if (id) {
          await Contact.findByIdAndUpdate(contact.id, contact, { new: true });
        }

        // New contact to create
        if (!id) {
          const { _id } = await Contact.create(contact);
          newContactIds.push(_id);
        }
      }
    }

    const hasNewContacts = newContactIds.length > 0;

    const group = this.executeWithGraphqlProjection(
      await this.model.findByIdAndUpdate(
        id,
        {
          ...updateFields,
          ...(hasNewContacts && { $push: { contacts: newContactIds } }),
          ...(address && { $set: this.createSubDocumentUpdateQuery("address", address) }),
        },
        { new: true }
      )
    );

    return group;
  }

  async deleteGroups(groupIds) {
    try {
      const { acknowledged: ok, modifiedCount: deletedCount } = await this.model.updateMany(
        { _id: groupIds },
        { deleted: true }
      );
      return { ok, deletedCount, deletedIds: groupIds };
    } catch (error) {
      return { ok: false, deletedCount: 0, deletedIds: [] };
    }
  }
}

module.exports = {
  GroupSource,
};
