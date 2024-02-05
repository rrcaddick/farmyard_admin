const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Contact, uniqueErrors } = require("../../../models/contact");
const { Group } = require("../../../models/group");
const { startSession } = require("mongoose");

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
        $or: [{ isDeleted: { $exists: false } }, { isDeleted: false }],
      })
    );
  }

  getContactTypes() {
    return this.model.schema.path("type").enumValues;
  }

  async createContact(contact) {
    let session;
    try {
      // No group, so no transaction required
      if (!contact?.groupId) return this.executeWithGraphqlProjection(await this.model.create(contact));

      // Start session and transaction
      session = await startSession();
      session.startTransaction();

      // Create contact
      const [newContact] = await this.executeWithGraphqlProjection(await this.model.create([contact], { session }));

      // Update group with new contact
      await Group.findByIdAndUpdate(contact.groupId, { $push: { contacts: newContact._id } }, { session });

      // Commit change and return contact
      await session.commitTransaction();
      return newContact;
      // Update group
    } catch (error) {
      session && (await session.abortTransaction());
      if (error.code === 11000) this.throwUniqueViolationGraphqlError(error, uniqueErrors);
      else throw error;
    } finally {
      session && (await session.endSession());
    }
  }

  async updateContact(contact) {
    const { id, groupId, type } = contact;
    const shouldRemoveGroupId = type && type !== "Group";
    let session;

    try {
      // Start session and transaction
      session = await startSession();
      session.startTransaction();

      // Get previous groupId
      const { groupId: previousGroupId } = await this.model.findById(id).session(session);

      // Pull contactId from previous groupId
      await Group.findByIdAndUpdate(previousGroupId, { $pull: { contacts: id } }, { session });

      // Push contactId to new group
      await Group.findByIdAndUpdate(groupId, { $push: { contacts: id } }, { session });

      // Update contact and return
      const newContact = await this.executeWithGraphqlProjection(
        await this.model.findByIdAndUpdate(
          id,
          { $set: { ...contact }, ...(shouldRemoveGroupId && { $unset: { groupId: true } }) },
          { new: true, session }
        )
      );

      // Commit transaction and return contact
      await session.commitTransaction();
      return newContact;
    } catch (error) {
      session && (await session.abortTransaction());
      if (error.code === 11000) this.throwUniqueViolationGraphqlError(error, uniqueErrors);
      else throw error;
    } finally {
      session && (await session.endSession());
    }
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
        { isDeleted: true },
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
