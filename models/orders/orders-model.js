const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  // The ISBN of the book being ordered
  isbn: {
    type: String,
    required: true,
    ref: "Book", // Reference to the Book model
  },
  price: {
    type: Number,
    required: true,
    ref: "Book",
  },
  // The user who placed the order
  userId: {
    type: String,
    required: true,
    ref: "User", // Reference to the User model
  },
  // The seller who is selling the book
  sellerId: {
    type: String,
    required: true,
    ref: "Seller", // Reference to the Seller model
  },
  // Full shipping address for the order
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
    },
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
  // Order status (e.g., pending, shipped, delivered, canceled)
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canceled"],
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
