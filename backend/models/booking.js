const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    date: { type: Long, required: true },
    createdBy: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
    },
    group: {
      _id: { type: Schema.Types.ObjectId, ref: "Group", required: true },
      name: { type: String, required: true },
      type: {
        group: { type: String, required: true },
      },
      address: {
        street: { type: String, required: true },
        suburb: { type: String, required: true },
        postCode: { type: Number, required: true },
      },
    },
    visitors: {
      total: { type: Number, required: true },
      adults: { type: Number },
      youth: { type: Number },
      kids: { type: Number },
      todlers: { type: Number },
    },
    price: {
      _id: { type: Schema.Types.ObjectId, ref: "Price", required: true },
      type: { type: String, required: true },
      amount: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    comments: [
      {
        createdAt: { type: Long, required: true },
        comment: { type: String, required: true },
        user: {
          _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
          name: { type: String, required: true },
        },
      },
    ],
    activity: [
      {
        createdAt: { type: Long, required: true },
        action: { type: String, required: true },
        user: {
          _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
          name: { type: String, required: true },
        },
      },
    ],
  },
  { timestamps: true }
);

const Booking = model("Booking", bookingSchema);

module.exports = { Booking };
