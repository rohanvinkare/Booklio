const Book = require("../../models/books/books-model");
const { validationResult } = require("express-validator");

const Seller = require("../../models/seller/seller-model");

//--------------------------  Add Book -----------------------
/**
 * For adding Book To the seller Stock
 */
const addBook = async (req, res) => {
  try {
    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { genre, isbn } = req.body;
    const sellerId = req.cred.credDecode.sellerId;

    // Check if the user already exists by email
    const isExists = await Seller.findOne({ sellerId: sellerId });
    if (!isExists) {
      return res.status(400).json({
        success: false,
        msg: `Seller : ${sellerId} dose Not Exists!`,
      });
    }

    // Create a new user instance
    const book = new Book({
      genre: genre,
      isbn: isbn,
      bookLink: `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyCCMhOfeT0EauL_FCQM--9076QzrNoru58`,
      sellerId: sellerId,
    });

    // Save the user in the database
    const bookData = await book.save();

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Book with ISBN ${isbn} added Successfully`,
      bookData: bookData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//------------------------ Delete Book -----------------------
/**
 * For Removing from seller Stock
 */
const removeBook = async (req, res) => {
  try {
    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const { isbn } = req.body;
    const sellerId = req.cred.credDecode.sellerId;

    // Find the book based on sellerId and isbn and delete it
    const deletedBook = await Book.findOneAndDelete({
      sellerId: sellerId,
      isbn: isbn,
    });

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        msg: `Book with ISBN: ${isbn} by Seller: ${sellerId} does not exist!`,
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Book with ISBN ${isbn} Deleted Successfully`,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

//--------------------------  Stock Book -----------------------
/**
 * For all Book that seller have in stock
 */
const stockBook = async (req, res) => {
  try {
    const sellerId = req.cred.credDecode.sellerId;

    // Check if the user already exists by email
    const isExists = await Seller.findOne({ sellerId: sellerId });
    if (!isExists) {
      return res.status(400).json({
        success: false,
        msg: `Seller : ${sellerId} dose Not Exists!`,
      });
    }

    // If the seller exists, find all books associated with the sellerId
    const booksData = await Book.find({ sellerId: sellerId });
    const sellerInfo = await Seller.findOne({ sellerId: sellerId });

    // Check if any books were found
    if (booksData.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found for Seller: ${sellerId}!`,
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `All Books From The Seller Stock`,
      sellerInfo: sellerInfo,
      booksData: booksData,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * Get all book ISBN from the Db  w.r.t there Genre
 */
const bookAllGenre = async (req, res) => {
  try {
    const genres = {
      horror: [],
      action: [],
      adventure: [],
      mystery: [],
      documentaries: [],
      comedy: [],
      drama: [],
      mythology: [],
      fantasy: [],
    };

    // Fetch all books from the database
    const books = await Book.find({}, { genre: 1, isbn: 1 }); // Only fetching genre and isbn for efficiency

    // Populate the genre arrays
    books.forEach((book) => {
      const { genre, isbn } = book;
      if (genres[genre.toLowerCase()]) {
        genres[genre.toLowerCase()].push(isbn);
      }
    });

    // Return success response with organized genre data
    return res.status(200).json({
      success: true,
      msg: "Books grouped by genre successfully",
      bookData: genres,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred",
    });
  }
};

/**
 * Get all book ISBN from the Db Sorted by the specific  genre
 */
const bookByGenre = async (req, res) => {
  try {
    const genre = req.params.genre; // Extract genre from the route parameter

    // Query the database for books with the specified genre
    const books = await Book.find({ genre: genre });

    // Check if books were found
    if (!books || books.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found for genre: ${genre}`,
      });
    }

    // Return success response with the list of books for the genre
    return res.status(200).json({
      success: true,
      msg: `Books found for genre: ${genre}`,
      data: books, // Return the array of books
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching books by genre",
    });
  }
};

/**
 * seller info that should public to access for user and gest user
 */
const allSeller = async (req, res) => {
  try {
    // Query to find all sellers, but exclude sensitive fields
    const sellers = await Seller.find(
      {},
      {
        sellerId: 1,
        name: 1,
        email: 1,
        storeName: 1,
        storeDescription: 1,
        image: 1,
        address: 1,
        socialMediaLinks: 1,
      }
    );

    // Return success response with the list of sellers
    return res.status(200).json({
      success: true,
      msg: "Sellers fetched successfully",
      data: sellers,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching sellers",
    });
  }
};

/**
 * public seller info and all the books that he is selling
 */
const booksBySeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    // Query to find the seller by sellerId
    const seller = await Seller.findOne({ sellerId: sellerId });

    if (!seller) {
      return res.status(404).json({
        success: false,
        msg: `Seller with sellerId ${sellerId} not found`,
      });
    }

    // Query to find all books by the sellerId
    const books = await Book.find({ sellerId: sellerId });

    // Return the seller info and the list of books they are selling
    return res.status(200).json({
      success: true,
      msg: `Seller information and books for sellerId ${sellerId}`,
      books: books,
      sellerInfo: seller,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      msg:
        error.message ||
        "An error occurred while fetching the seller and their books",
    });
  }
};

const sellersByBook = async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const books = await Book.find({ isbn: isbn });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found with ISBN ${isbn}`,
      });
    }

    // Extract sellerIds from the books found
    const sellerIds = books.map((book) => book.sellerId);

    // Query to find all sellers with the extracted sellerIds
    const sellers = await Seller.find({ sellerId: { $in: sellerIds } });

    // Return success response with the sellers information
    return res.status(200).json({
      success: true,
      msg: `Sellers selling the book with ISBN ${isbn}`,
      sellers: sellers,
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching sellers by book",
    });
  }
};

module.exports = {
  addBook,
  removeBook,
  stockBook,
  bookAllGenre,
  bookByGenre,
  allSeller,
  booksBySeller,
  sellersByBook,
};
