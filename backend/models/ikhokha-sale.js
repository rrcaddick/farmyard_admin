const mongoose = require("mongoose");

const ikhokhaSaleSchema = new mongoose.Schema({
  date: {
    type: String,
    required: "Date is required",
  },
  ref: {
    type: String,
    required: "Ref is required",
  },
  employee: {
    type: String,
    required: "Employee is required",
  },
  paymentType: {
    type: String,
    required: "Payment type is required",
  },
  amount: {
    type: Number,
    required: "Amount type is required",
  },
  saleType: {
    type: String,
    required: "Sale type type is required",
  },
  saleDesc: {
    type: String,
    required: "Sale description type is required",
  },
  quantity: {
    type: Number,
    required: "Quantity type is required",
  },
});

const IkhokhaSale = mongoose.model("IkhokhaSale", ikhokhaSaleSchema);

module.exports = {
  IkhokhaSale,
};
