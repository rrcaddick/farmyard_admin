const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Group } = require("../../../models/group");
const { Contact, uniqueErrors } = require("../../../models/contact");
const { startSession } = require("mongoose");
const { createDocumentArray } = require("../../../mongodb/utils/transactions");

class GroupSource extends MongoDataSource {
  constructor() {
    super(Group);
  }

  async getGroup(groupId) {
    return this.executeWithGraphqlProjection(
      this.model.findOne({ _id: groupId, $or: [{ deleted: { $exists: false } }, { deleted: false }] })
    );
  }

  // Look into this for later
  // async getGroup(groupId, { field, value } = {}) {
  //   return this.executeWithGraphqlProjection(
  //     this.model.findOne({
  //       [field ?? "_id"]: groupId ?? value,
  //       $or: [{ deleted: { $exists: false } }, { deleted: false }],
  //     })
  //   );
  // }

  async getGroups(groupIds) {
    return this.executeWithGraphqlProjection(
      this.model.find({
        ...(groupIds && { _id: groupIds }),
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      })
    );
  }

  async createGroup(input) {
    // Get group without contacts
    const { contacts, ...group } = input;

    // Create group without contacts and return
    if (!contacts?.length > 0) return this.executeWithGraphqlProjection(await this.model.create({ ...group }));

    // If group has contacts start session
    const session = await startSession();

    try {
      session.startTransaction();
      const [{ _id: groupId }] = await this.model.create([{ ...group }], { session: session });

      // Create contacts or throw duplicate error
      const contactsWithId = contacts.map((contact) => ({ ...contact, groupId }));
      const newContacts = await createDocumentArray(contactsWithId, "contacts", Contact, uniqueErrors, session);

      // Update the group contacts array
      const newGroup = await this.executeWithGraphqlProjection(
        await this.model.findByIdAndUpdate(
          groupId,
          { contacts: newContacts.map(({ _id }) => _id) },
          { new: true, session }
        )
      );

      // 4. Commit the changes
      await session.commitTransaction();
      // Return new group
      return newGroup;
    } catch (error) {
      // Transaction failed
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateGroup(input) {
    const { id, contacts, address, ...updateFields } = input;
    const newContactIds = [];

    if (contacts && contacts.length > 0) {
      for (let contact of contacts) {
        if (!contact) continue;

        const { id, shouldDelete } = contact;
        // Contact to delete
        if (id && shouldDelete) {
          // Delete contact
          await Contact.findByIdAndUpdate(id, { isDeleted: true });
          // Remove id from array
          await this.model.findByIdAndUpdate(id, { $pull: { contacts: id } }, { new: true });
        }

        try {
          // Existing contact to update
          if (id) {
            await Contact.findByIdAndUpdate(contact.id, contact, { new: true });
          }

          // New contact to create
          if (!id) {
            const { _id } = await Contact.create(contact);
            newContactIds.push(_id);
          }
        } catch (error) {
          console.log(error);
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

  async restoreGroups(groupIds) {
    const { acknowledged: ok } = await this.model.updateMany({ _id: groupIds }, { deleted: false });
    return this.executeWithGraphqlProjection(
      this.model.find({
        _id: groupIds,
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      })
    );
  }
}

module.exports = {
  GroupSource,
};
