const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    type: { type: String, enum: ["group", "online", "other"], default: "group", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: "Contact already exists for this email" },
    tel: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = model("Contact", contactSchema);

module.exports = { Contact };
