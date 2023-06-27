const { Schema, model } = require("mongoose");
const { Group } = require("./group");

const contactSchema = new Schema(
  {
    type: { type: String, enum: ["Group", "Online", "Other"], default: "Group", required: true },
    name: { type: String, required: true },
    email: { type: String, unique: "Contact already exists for this email" },
    tel: { type: String },
    deleted: Boolean,
  },
  { timestamps: true }
);

contactSchema.post("save", async function ({ _id }) {
  const { groupId } = this.$__.saveOptions;

  if (groupId)
    await Group.findByIdAndUpdate(groupId, { $push: { contacts: _id } }, { safe: true, upsert: true, new: true });
});

contactSchema.post("updateMany", async function (doc) {
  const { contactIds } = this.options;
  await Group.updateMany({ contacts: { $in: contactIds } }, { $pull: { contacts: { $in: contactIds } } });
});

const Contact = model("Contact", contactSchema);

module.exports = { Contact };
