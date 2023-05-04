const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    name: { type: String, required: true },
    type: {
      group: { type: String, required: true },
      price: { type: Schema.Types.ObjectId, ref: "Price", required: true },
    },
    address: {
      street: { type: String, required: true },
      suburb: { type: String, required: true },
      postCode: { type: Number, required: true },
    },
    contacts: [{ type: Schema.Types.ObjectId, ref: "Contact" }],
  },
  { timestamps: true }
);

const Group = model("Group", groupSchema);

module.exports = { Group };
