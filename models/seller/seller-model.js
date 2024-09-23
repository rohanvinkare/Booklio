const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const sellerSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  storeName: {
    type: String,
    required: true,
  },
  storeDescription: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  upiId: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  gstNumber: {
    type: String,
    required: true, // Making GST number mandatory
  },
  socialMediaLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
  },
  is_verified: {
    type: Number,
    default: 0, // 1--> verified
  },

  role: {
    type: String,
    default: "seller",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
