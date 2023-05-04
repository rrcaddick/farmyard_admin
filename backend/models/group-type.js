const { Schema, model } = require("mongoose");

const groupTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    price: { type: Schema.Types.ObjectId, ref: "Price", required: true },
  },
  { timestamps: true }
);

const GroupType = model("GroupType", groupSchema);

module.exports = { GroupType };
