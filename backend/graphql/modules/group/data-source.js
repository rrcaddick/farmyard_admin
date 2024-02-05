const { MongoDataSource } = require("../../data-source/mongo-data-source");
const { Group } = require("../../../models/group");
const { Contact, uniqueErrors } = require("../../../models/contact");
const { startSession } = require("mongoose");

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
      const [{ _id: groupId }] = await this.model.create([{ ...group }], { session });

      // Create contacts or throw duplicate error
      const contactsWithId = contacts.map((contact) => ({ ...contact, groupId }));
      const newContacts = await this.createDocumentsFromArray(
        contactsWithId,
        "contacts",
        Contact,
        uniqueErrors,
        session
      );

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

  async updateGroup(input, deletedContacts) {
    // Check for contacts
    const { id: groupId, contacts, address, ...group } = input;

    // No contacts, return updateGroup
    // if (!contacts?.length > 0) {
    //   return this.executeWithGraphqlProjection(
    //     await this.model.findByIdAndUpdate(
    //       groupId,
    //       { ...group, ...(address && { $set: this.createSubDocumentUpdateQuery("address", address) }) },
    //       { new: true }
    //     )
    //   );
    // }

    // Start transaction
    let session;
    const newContactIds = [];

    try {
      session = await startSession();
      session.startTransaction();

      for (let id of deletedContacts) {
        await Contact.findByIdAndUpdate(id, { isDeleted: true }, { session });
        // Remove id from contacts array
        await this.model.findByIdAndUpdate(groupId, { $pull: { contacts: id } }, { new: true, session });
      }

      for (let i = 0; i < contacts.length; i++) {
        // Null contact used for index placeholder
        if (!contacts[i]) continue;

        const { id, shouldDelete } = contacts[i];

        // Existing contact to update
        if (id) {
          await Contact.findByIdAndUpdate(id, contacts[i], { new: true, session });
        }

        // New contact to create
        if (!id) {
          const [{ _id }] = await Contact.create([{ ...contacts[i], groupId }], { session });
          newContactIds.push(_id);
        }
      }

      const updatedGroup = await this.executeWithGraphqlProjection(
        await this.model.findByIdAndUpdate(
          groupId,
          {
            ...group,
            ...(newContactIds.length > 0 && { $push: { contacts: newContactIds } }),
            ...(address && { $set: this.createSubDocumentUpdateQuery("address", address) }),
          },
          { new: true, session }
        )
      );

      await session.commitTransaction();
      return updatedGroup;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async updateGroup1(input) {
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
        { isDeleted: true }
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
