const mongoose = require("mongoose");

const sellerPasswordResetSchema = new mongoose.Schema({
  user_id: {
    type: String,
    requierd: true,
    ref: "Seller",
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "SellerPasswordReset",
  sellerPasswordResetSchema
);
