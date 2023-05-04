const { Schema, model } = require("mongoose");

const priceSchema = new Schema(
  {
    type: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Price = model("Price", priceSchema);

module.exports = { Price };
