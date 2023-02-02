const mongoose = require("mongoose");

const quicketSaleSchema = new mongoose.Schema({
  orderNumbers: {
    type: [Number],
    required: "Order Numbers are required",
  },
  eventDate: {
    type: String,
    required: "Event Date is required",
  },
  purchaserEmail: {
    type: String,
    required: "Purchaser Email is required",
  },
  visitors: {
    type: Number,
    required: "Visitors are required",
  },
  hires: {
    type: [String],
  },
});

const QuicketSale = mongoose.model("QuicketSale", quicketSaleSchema);

module.exports = {
  QuicketSale,
};
