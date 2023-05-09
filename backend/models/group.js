const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    groupType: {
      id: { type: Schema.Types.ObjectId, ref: "GroupType", required: true },
      type: { type: String, required: true },
      price: { type: Schema.Types.ObjectId, ref: "Price", required: true, shouldPopulate: true },
    },
    address: {
      street: { type: String, required: true },
      suburb: { type: String, required: true },
      postCode: { type: Number, required: true },
    },
    contacts: { type: [{ type: Schema.Types.ObjectId, ref: "Contact" }], shouldPopulate: true },
  },
  { timestamps: true }
);

const Group = model("Group", groupSchema);

module.exports = { Group };
