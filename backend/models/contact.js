const { UserInputError } = require("apollo-server-express");
const { Schema, model } = require("mongoose");
const { throwUniqueGrpahqlError } = require("../utils/mongo-db");
const { Group } = require("./group");

const uniqueErrors = {
  email: "Contact already exist with this email address",
  tel: "Contact already exist with this phone number",
};

const contactSchema = new Schema(
  {
    type: { type: String, enum: ["Group", "Online", "Other"], default: "Group", required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true },
    tel: { type: String, unique: true },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    deleted: Boolean,
  },
  { timestamps: true }
);

contactSchema.post("save", async function ({ groupId, _id }) {
  if (groupId)
    await Group.findByIdAndUpdate(groupId, { $push: { contacts: _id } }, { safe: true, upsert: true, new: true });
});

contactSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    throwUniqueGrpahqlError(error, uniqueErrors);
  } else {
    next(error);
  }
});

contactSchema.post("findOneAndUpdate", async function ({ groupId, _id }) {
  const { previousGroupId } = this.options;
  if (groupId) {
    previousGroupId &&
      (await Group.findByIdAndUpdate(
        previousGroupId,
        { $pull: { contacts: _id } },
        { safe: true, upsert: true, new: true }
      ));
    await Group.findByIdAndUpdate(groupId, { $push: { contacts: _id } }, { safe: true, upsert: true, new: true });
  }
});

contactSchema.post("updateMany", async function (doc) {
  const { contactIds } = this.options;
  if (contactIds || contactIds.length > 0)
    await Group.updateMany({ contacts: { $in: contactIds } }, { $pull: { contacts: { $in: contactIds } } });
});

const Contact = model("Contact", contactSchema);

module.exports = { Contact };
