const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Importing the uuid function

const orderSchema = new mongoose.Schema({
  // Unique order ID
  orderId: {
    type: String,
    default: uuidv4, // Generate a new UUID by default
    unique: true, // Ensure the orderId is unique
  },

  isbn: {
    type: String,
    required: true,
    ref: "Book",
  },
  price: {
    type: Number,
    required: true,
    ref: "Book",
  },
  quantity: {
    type: Number,
    required: true,
  },

  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  // The seller who is selling the book
  sellerId: {
    type: String,
    required: true,
    ref: "Seller", // Reference to the Seller model
  },
  // Full shipping address for the order
  shippingAddress: {
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
  // Order status (e.g., pending, shipped, delivered, cancelled)
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled", "completed"],
    default: "pending",
  },
  // Timestamp for when the order was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional timestamp for when the order was updated
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the updatedAt field on every save
orderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
