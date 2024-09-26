const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  // Total price for the order
  price: {
    type: Number,
    required: true,
  },
  bookLink: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  }, // Linking to the seller
});

// Compound unique index on sellerId and isbn
bookSchema.index({ sellerId: 1, isbn: 1 }, { unique: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
