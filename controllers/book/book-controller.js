const axios = require("axios");
const Book = require("../../models/books/books-model");
const { validationResult } = require("express-validator");
const Seller = require("../../models/seller/seller-model");
const { getCache, setCache, delCache } = require("../../cache/node-cache");

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

    const { genre, isbn, price } = req.body;
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
      price: price,
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

//--------------------------  Add Book From Google-----------------------
/**
 * For adding Book To the seller Stock by google Api With ISBN
 */
const addBookGoogleAPI = async (req, res) => {
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

    const sellerId = req.cred.credDecode.sellerId;
    const { isbn, price } = req.body;

    // Check if seller exists in the DB
    const sellerExists = await Seller.findOne({ sellerId: sellerId });
    if (!sellerExists) {
      return res.status(400).json({
        success: false,
        msg: `Seller with ID: ${sellerId} does not exist.`,
      });
    }

    // Check if the book already exists in the database
    let bookExists = await Book.findOne({ isbn: isbn });

    if (bookExists) {
      // Check if the seller already exists in the spCluster array
      const sellerFound = bookExists.spCluster.find(
        (coast) => coast.sellerId === sellerId
      );

      if (sellerFound) {
        return res.status(200).json({
          success: true,
          msg: `Seller ID ${sellerId} is already associated with the book having ISBN ${isbn}.`,
          bookData: bookExists,
        });
      } else {
        // Add the sellerId and price to the spCluster array if seller doesn't exist
        bookExists.spCluster.push({ sellerId: sellerId, price: price });
        const updatedBook = await bookExists.save();

        // Deleting all cache for consistency
        delCache("all_genre_books");
        delCache(sellerId);

        return res.status(200).json({
          success: true,
          msg: `Seller ID ${sellerId} added to the book with ISBN ${isbn} with price ${price}.`,
          bookData: updatedBook,
        });
      }
    }

    // If the book doesn't exist, call Google Books API to get book data
    const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.googleapis_key}`;
    const googleApiResponse = await axios.get(googleBooksApiUrl);
    const bookDataFromApi = googleApiResponse.data.items[0];

    if (!bookDataFromApi) {
      return res.status(404).json({
        success: false,
        msg: `No book found with ISBN: ${isbn}.`,
      });
    }

    // Extract genre (categories) from the API response
    let genre = bookDataFromApi.volumeInfo.categories || ["Unknown"];

    // Store the new book in the database
    const newBook = new Book({
      isbn: isbn,
      genre: genre,
      spCluster: [{ sellerId: sellerId, price: price }],
      data: bookDataFromApi,
    });

    const savedBook = await newBook.save();

    // Deleting all cache for consistency
    delCache("all_genre_books");
    delCache(sellerId);

    // Respond with success message
    return res.status(200).json({
      success: true,
      msg: `Book with ISBN ${isbn} added successfully.`,
      bookData: savedBook,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while adding the book.",
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

/**
 * For Removing the book from the sellers stock
 */
const removeSellerFromBook = async (req, res) => {
  try {
    // Validate the request
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    const sellerId = req.cred.credDecode.sellerId;
    const { isbn } = req.body;

    // Find the book by ISBN
    const bookExists = await Book.findOne({ isbn: isbn });
    if (!bookExists) {
      return res.status(404).json({
        success: false,
        msg: `Book with ISBN ${isbn} not found.`,
      });
    }

    // Check if the seller exists in the spCluster
    const sellerIndex = bookExists.spCluster.findIndex(
      (coast) => coast.sellerId === sellerId
    );

    if (sellerIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: `Seller ID ${sellerId} is not associated with this book.`,
      });
    }

    // Remove the seller from spCluster array
    bookExists.spCluster.splice(sellerIndex, 1);

    // Check if the spCluster array is empty after removal
    if (bookExists.spCluster.length === 0) {
      // No sellers left, delete the book
      await Book.deleteOne({ isbn: isbn });

      // Deleting all cache for consistency
      delCache("all_genre_books");
      delCache(sellerId);

      return res.status(200).json({
        success: true,
        msg: `Book with ISBN ${isbn} deleted because no sellers are left.`,
      });
    } else {
      // Sellers remain, update the book without the removed seller
      const updatedBook = await bookExists.save();

      // Deleting all cache for consistency
      delCache("all_genre_books");
      delCache(sellerId);

      return res.status(200).json({
        success: true,
        msg: `Seller ID ${sellerId} removed from the book with ISBN ${isbn}.`,
        bookData: updatedBook,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while removing the seller.",
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
 * For all Book that seller have in stock
 */

const sellerStockBook = async (req, res) => {
  try {
    const sellerId = req.cred.credDecode.sellerId;

    const cacheKey = sellerId;
    // Check if the data is already cached
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        msg: `All Books from Seller ${sellerId}'s Stock.from cache`,
        booksData: cachedData,
      });
    }

    // Check if the seller exists
    const sellerExists = await Seller.findOne({ sellerId: sellerId });
    if (!sellerExists) {
      return res.status(400).json({
        success: false,
        msg: `Seller with ID: ${sellerId} does not exist!`,
      });
    }

    // Find books that have the seller in the spCluster array
    const booksData = await Book.find({ "spCluster.sellerId": sellerId });

    // Check if any books were found for the seller
    if (booksData.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found for Seller: ${sellerId}.`,
      });
    }

    // Store the processed data in cache
    setCache(cacheKey, booksData);

    // Respond with success and the list of books in stock for the seller
    return res.status(200).json({
      success: true,
      msg: `All Books from Seller ${sellerId}'s Stock.`,
      booksData: booksData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching the stock.",
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
 * Get all book Data from the Db  w.r.t there Genre APi
 * it is heavy task so better if you cache the data as soon as app is started so Work on this
 */

const bookAllGenreGoogleAPI = async (req, res) => {
  try {
    const cacheKey = "all_genre_books";
    // Check if the data is already cached
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        msg: "Books grouped by genre fetched from cache",
        bookData: cachedData,
      });
    }

    const genres = {};

    const books = await Book.find({}, { _id: 0 });

    // Iterate through each book and categorize them based on genres
    books.forEach((book) => {
      const { genre } = book;

      // Iterate through each genre in the genre array
      genre.forEach((g) => {
        const lowerGenre = g.toLowerCase();

        if (!genres[lowerGenre]) {
          genres[lowerGenre] = [];
        }
        genres[lowerGenre].push(book);
      });
    });

    // Store the processed data in cache
    setCache(cacheKey, genres);

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
 * Get all book Data from the Db Sorted by the specific  genre
 */

const bookByGenreGoogleAPI = async (req, res) => {
  try {
    const { genre } = req.params;

    if (!genre) {
      return res.status(400).json({
        success: false,
        msg: "Genre is required in the request parameters",
      });
    }

    // Find books that have the genre in their genre array (case-insensitive)
    const books = await Book.find({
      genre: { $regex: new RegExp(genre, "i") },
    });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found for genre: ${genre}`,
      });
    }

    // Return the found books
    return res.status(200).json({
      success: true,
      msg: `Books found for genre: ${genre}`,
      bookData: books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred",
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
    const { sellerId } = req.params;

    const seller = await Seller.findOne({ sellerId });

    if (!seller) {
      return res.status(404).json({
        success: false,
        msg: `Seller with sellerId ${sellerId} not found`,
      });
    }

    // Query to find all books where spCluster contains the sellerId
    const books = await Book.find({
      spCluster: { $elemMatch: { sellerId } },
    });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found for sellerId ${sellerId}`,
      });
    }

    // Return the seller info and the list of books they are selling
    return res.status(200).json({
      success: true,
      msg: `Seller information and books for sellerId ${sellerId}`,
      books,
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

/**
 * Book info And all the seller selling it
 */

const sellersByBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Query to find the book by ISBN
    const books = await Book.find({ isbn });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found with ISBN ${isbn}`,
      });
    }

    // Extract all sellerIds from the spCluster arrays in the found books
    const sellerIds = [];
    books.forEach((book) => {
      book.spCluster.forEach((cluster) => {
        if (!sellerIds.includes(cluster.sellerId)) {
          sellerIds.push(cluster.sellerId); // Ensure unique sellerIds
        }
      });
    });

    const sellers = await Seller.find({ sellerId: { $in: sellerIds } });

    if (sellers.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No sellers found for the book with ISBN ${isbn}`,
      });
    }

    return res.status(200).json({
      success: true,
      msg: `Sellers selling the book with ISBN ${isbn}`,
      sellers,
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

  addBookGoogleAPI,
  removeSellerFromBook,
  sellerStockBook,
  bookAllGenreGoogleAPI,
  bookByGenreGoogleAPI,
};
