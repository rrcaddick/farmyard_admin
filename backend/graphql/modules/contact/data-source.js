const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Contact } = require("../../../models/contact");
const { Group } = require("../../../models/group");

class ContactSource extends MongoDataSource {
  constructor() {
    super(Contact);
  }

  async getContact(contactId) {
    return this.executeWithGraphqlProjection(
      this.model.find({ _id: contactId, $or: [{ deleted: { $exists: false } }, { deleted: false }] })
    );
  }

  async getContacts(contactIds) {
    return this.executeWithGraphqlProjection(
      this.model.find({
        ...(contactIds && { _id: contactIds }),
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      })
    );
  }

  async createContact(input, groupId) {
    const [contact] = await this.model.create([input], { ...(groupId && { groupId }) });
    return this.executeWithGraphqlProjection(contact);
  }

  async updateContact(input) {
    const { id, ...contact } = input;
    return this.executeWithGraphqlProjection(await this.model.findByIdAndUpdate(id, contact, { new: true }));
  }

  async deleteContacts(contactIds) {
    try {
      const restoreInfo = (await Group.find({ contacts: { $in: contactIds } }).select({ _id: 1, contacts: 1 })).reduce(
        (restoreInfo, group) => {
          const { _id: id, contacts } = group;
          return {
            ...restoreInfo,
            [id]: contacts.reduce((contacts, contact) => {
              if (contactIds.includes(contact.toString())) {
                return [...contacts, contact.toString()];
              }
              return contacts;
            }, []),
          };
        },
        {}
      );

      const { acknowledged: ok, modifiedCount: deletedCount } = await this.model.updateMany(
        { _id: { $in: contactIds } },
        { deleted: true },
        { contactIds }
      );
      return { ok, deletedCount, deletedIds: contactIds, restoreInfo: JSON.stringify(restoreInfo) };
    } catch (error) {
      return { ok: false, deletedCount: 0, deletedIds: [], restoreInfo: null };
    }
  }

  async restoreContacts(contactIds, restoreInfo) {
    const _restoreInfo = JSON.parse(restoreInfo);
    // Update each contact to remove deleted
    const { acknowledged: ok } = await this.model.updateMany({ _id: contactIds }, { deleted: false });

    // Update each group and push contactId to them
    for (let group of Object.keys(_restoreInfo)) {
      await Group.findByIdAndUpdate(group, { $push: { contacts: { $each: _restoreInfo[group] } } });
    }

    // Return updated contacts
    return this.executeWithGraphqlProjection(
      this.model.find({
        _id: contactIds,
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      })
    );
  }
}

module.exports = {
  ContactSource,
};
