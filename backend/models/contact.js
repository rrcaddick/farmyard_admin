const { Schema, model } = require("mongoose");

const uniqueErrors = {
  email: "Contact already exist with this email address",
  tel: "Contact already exist with this phone number",
};

const contactSchema = new Schema(
  {
    type: { type: String, enum: ["Group", "Online", "Other"], default: "Group", required: true },
    name: { type: String, required: true },
    email: { type: String },
    tel: { type: String },
    groupId: { type: Schema.Types.ObjectId, ref: "Group" },
    isDeleted: { type: Boolean, index: true, default: false },
  },
  { timestamps: true }
);

contactSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      email: { $exists: true, $gt: "", $type: "string" },
    },
  }
);

contactSchema.index(
  { tel: 1 },
  {
    unique: true,
    partialFilterExpression: {
      isDeleted: false,
      tel: { $exists: true, $gt: "", $type: "string" },
    },
  }
);

const Contact = model("Contact", contactSchema);

module.exports = { Contact, uniqueErrors };
