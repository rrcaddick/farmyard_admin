const { Schema, model } = require("mongoose");
const { getUnixEpochSeconds } = require("../utils/date");

const bookingSchema = new Schema(
  {
    date: { type: Number, required: true },
    createdBy: {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
    },
    bookedBy: {
      contact: { type: Schema.Types.ObjectId, ref: "Contact", required: true },
      name: { type: String, required: true },
    },
    status: {
      type: String,
      enum: [
        "Created",
        "Awaiting Confirmation",
        "Confirmed",
        "Awaiting Deposit",
        "Deposit Paid",
        "Completed",
        "Canceled",
      ],
      default: "Created",
      required: true,
    },
    group: {
      id: { type: Schema.Types.ObjectId, ref: "Group", required: true },
      name: { type: String, required: true },
      groupType: {
        id: { type: Schema.Types.ObjectId, ref: "GroupType", required: true },
        type: { type: String, required: true },
      },
      address: {
        street: { type: String, required: true },
        suburb: { type: String, required: true },
        postCode: { type: Number, required: true },
      },
      // TODO: Should contacts be stored on bookoing?
    },
    visitors: {
      total: { type: Number, required: true },
      adults: { type: Number },
      youth: { type: Number },
      kids: { type: Number },
      todlers: { type: Number },
    },
    price: {
      id: { type: Schema.Types.ObjectId, ref: "Price", required: true },
      type: { type: String, required: true },
      amount: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    comments: [
      {
        createdAt: { type: Number, required: true, default: getUnixEpochSeconds() },
        comment: { type: String, required: true },
        createdBy: {
          user: { type: Schema.Types.ObjectId, ref: "User", required: true },
          name: { type: String, required: true },
        },
      },
    ],
    activity: [
      {
        createdAt: { type: Number, required: true, default: getUnixEpochSeconds() },
        action: { type: String, required: true },
        createdBy: {
          user: { type: Schema.Types.ObjectId, ref: "User", required: true },
          name: { type: String, required: true },
        },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const Booking = model("Booking", bookingSchema);

module.exports = { Booking };
