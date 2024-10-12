const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  genre: {
    // type: String,
    type: Array,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  spCluster: [
    {
      sellerId: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  data: {
    type: mongoose.Schema.Types.Mixed, // This will allow any type of data (flexible schema)
    default: {},
  },
});

// Compound unique index on sellerId and isbn
bookSchema.index({ sellerId: 1, isbn: 1 }, { unique: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
