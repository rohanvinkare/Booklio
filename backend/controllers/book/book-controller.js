const axios = require("axios");
const Book = require("../../models/books/books-model");
const { validationResult } = require("express-validator");
const Seller = require("../../models/seller/seller-model");
const Order = require("../../models/orders/orders-model");
const { getCache, setCache, delCache } = require("../../cache/redis_config");



/**
 * @swagger
 * tags:
 *   - name: Books
 *     description: Operations related to books management
 */

//--------------------------  Add Book -----------------------

//--------------------------  Add Book From Google-----------------------
/**
 * For adding Book To the seller Stock by google Api With ISBN
 */
/**
 * @swagger
 * /book/api/v1/add-book:
 *   post:
 *     tags:
 *       - Books
 *     summary: Add a book to the seller's stock using Google Books API.
 *     description: Adds a book to the seller's stock using ISBN and Google Books API data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isbn
 *               - price
 *               - stock
 *             properties:
 *               isbn:
 *                 type: string
 *                 example: "9780140449136"
 *               price:
 *                 type: number
 *                 example: 299.99
 *               stock:
 *                 type: number
 *                 example: 10
 *     responses:
 *       200:
 *         description: Book successfully added.
 *       400:
 *         description: Invalid request or seller not found.
 *       500:
 *         description: Server error.
 */


// const addBookGoogleAPI = async (req, res) => {
//   try {


//     // Validating the req with express validator
//     const valErrors = validationResult(req);
//     if (!valErrors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: valErrors.array()
//         // msg: "Errors",
//         // error: valErrors.array(),
//       });
//     }

//     const sellerId = req.cred.credDecode.sellerId;
//     const { isbn, price, stock } = req.body;



//     // Check if seller exists in the DB
//     const sellerExists = await Seller.findOne({ sellerId: sellerId });
//     if (!sellerExists) {
//       return res.status(400).json({
//         success: false,
//         msg: `Seller with ID: ${sellerId} does not exist.`,
//       });
//     }


//     // Check if the book already exists in the database
//     let bookExists = await Book.findOne({ isbn: isbn });

//     if (bookExists) {
//       // Check if the seller already exists in the spCluster array
//       const sellerFound = bookExists.spCluster.find(
//         (coast) => coast.sellerId === sellerId
//       );


//       if (sellerFound) {
//         return res.status(200).json({
//           success: true,
//           msg: `Seller ID ${sellerId} is already associated with the book having ISBN ${isbn}.`,
//           bookData: bookExists,
//         });


//       } else {
//         // Add the sellerId and price to the spCluster array if seller doesn't exist
//         bookExists.spCluster.push({ sellerId: sellerId, price: price, stock: stock });
//         const updatedBook = await bookExists.save();


//         // Deleting all cache for consistency
//         delCache("all_genre_books");
//         delCache(`${sellerId}:sellerStockBook:books`);   

//         return res.status(200).json({
//           success: true,
//           msg: `Seller ID ${sellerId} added to the book with ISBN ${isbn} with price ${price}.`,
//           bookData: updatedBook,
//         });
//       }
//     }


//     // If the book doesn't exist, call Google Books API to get book data
//     const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${process.env.googleapis_key}`;
//     const googleApiResponse = await axios.get(googleBooksApiUrl);
//     const bookDataFromApi = googleApiResponse.data.items[0];


//     if (!bookDataFromApi) {
//       return res.status(404).json({
//         success: false,
//         msg: `No book found with ISBN: ${isbn}.`,
//       });
//     }

//     // Extract genre (categories) from the API response
//     let genre = bookDataFromApi.volumeInfo.categories || ["Unknown"];


//     // Store the new book in the database
//     const newBook = new Book({
//       isbn: isbn,
//       genre: genre,
//       spCluster: [{ sellerId: sellerId, price: price, stock: stock }],
//       data: bookDataFromApi,
//     });
//     const savedBook = await newBook.save();

//     // Deleting all cache for consistency
//     delCache("all_genre_books");
//     delCache(`${sellerId}:sellerStockBook:books`); 

//     // Respond with success message
//     return res.status(200).json({
//       success: true,
//       msg: `Book with ISBN ${isbn} added successfully.`,
//       bookData: savedBook,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       msg: error.message || "An error occurred while adding the book.",
//     });
//   }
// };

//------------------------ Delete Book -----------------------

const addBookGoogleAPI = async (req, res) => {
  try {
    // Validating the req with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: valErrors.array()
      });
    }

    const sellerId = req.cred.credDecode.sellerId;
    const { isbn, price, stock } = req.body;

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
        // If the seller exists, update the stock for that seller
        sellerFound.stock += stock;  // Increase stock
        sellerFound.price = price;   // Update price if necessary

        const updatedBook = await bookExists.save();

        // Deleting all cache for consistency
        delCache("all_genre_books");
        delCache(`${sellerId}:sellerStockBook:books`);

        return res.status(200).json({
          success: true,
          msg: `Stock updated for Seller ID ${sellerId} for the book with ISBN ${isbn}.`,
          bookData: updatedBook,
        });
      } else {
        // Add the sellerId and price to the spCluster array if seller doesn't exist
        bookExists.spCluster.push({ sellerId: sellerId, price: price, stock: stock });
        const updatedBook = await bookExists.save();

        // Deleting all cache for consistency
        delCache("all_genre_books");
        delCache(`${sellerId}:sellerStockBook:books`);

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
      spCluster: [{ sellerId: sellerId, price: price, stock: stock }],
      data: bookDataFromApi,
    });
    const savedBook = await newBook.save();

    // Deleting all cache for consistency
    delCache("all_genre_books");
    delCache(`${sellerId}:sellerStockBook:books`);

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


/**
 * For Removing the book from the sellers shop 
 */

/**
 * @swagger
 * /book/api/v1/remove-book:
 *   post:
 *     tags:
 *       - Books
 *     summary: Remove a book from the seller's stock.
 *     description: Removes a book from the seller's stock using ISBN.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isbn
 *             properties:
 *               isbn:
 *                 type: string
 *                 example: "978-3-16-148410-0"
 *     responses:
 *       200:
 *         description: Book successfully removed.
 *         
 *       400:
 *         description: Invalid request (e.g., missing ISBN).
 *        
 *       404:
 *         description: Book not found.
 *      
 *       500:
 *         description: Server error.
 *       
 */

// const removeSellerFromBook = async (req, res) => {
//   try {


//     // Validate the request
//     const valErrors = validationResult(req);
//     if (!valErrors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Errors",
//         error: valErrors.array(),
//       });
//     }

//     const sellerId = req.cred.credDecode.sellerId;
//     const { isbn } = req.body;
//     console.log(isbn);


//     // Find the book by ISBN
//     const bookExists = await Book.findOne({ isbn: isbn });
//     if (!bookExists) {
//       return res.status(404).json({
//         success: false,
//         msg: `Book with ISBN ${isbn} not found.`,
//       });
//     }



//     // Check if the seller exists in the spCluster
//     const sellerIndex = bookExists.spCluster.findIndex(
//       (coast) => coast.sellerId === sellerId
//     );

//     if (sellerIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         msg: `Seller ID ${sellerId} is not associated with this book.`,
//       });
//     }



//     // Remove the seller from spCluster array
//     bookExists.spCluster.splice(sellerIndex, 1);


//     // Check if the spCluster array is empty after removal
//     if (bookExists.spCluster.length === 0) {
//       // No sellers left, delete the book
//       await Book.deleteOne({ isbn: isbn });


//       // Deleting all cache for consistency
//       delCache("all_genre_books");
//       delCache(sellerId);

//       return res.status(200).json({
//         success: true,
//         msg: `Book with ISBN ${isbn} deleted because no sellers are left.`,
//       });
//     } else {
//       // Sellers remain, update the book without the removed seller
//       const updatedBook = await bookExists.save();



//       // Deleting all cache for consistency
//       delCache("all_genre_books");
//       delCache(sellerId);

//       return res.status(200).json({
//         success: true,
//         msg: `Seller ID ${sellerId} removed from the book with ISBN ${isbn}.`,
//         bookData: updatedBook,
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       msg: error.message || "An error occurred while removing the seller.",
//     });
//   }
// };

//--------------------------  Stock Book -----------------------

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

    // Check if there are any active orders associated with this book and seller
    const existingOrders = await Order.findOne({
      isbn: isbn,
      sellerId: sellerId,
      status: { $nin: ["canceled"] }, // Ignore canceled and completed orders
    });

    if (existingOrders) {
      return res.status(400).json({
        success: false,
        msg: `Cannot remove seller. There are active orders associated with this book (ISBN: ${isbn}).`,
      });
    }

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
      delCache(`${sellerId}:sellerStockBook:books`);

      return res.status(200).json({
        success: true,
        msg: `Book with ISBN ${isbn} deleted because no sellers are left.`,
      });
    } else {
      // Sellers remain, update the book without the removed seller
      const updatedBook = await bookExists.save();

      // Deleting all cache for consistency
      delCache("all_genre_books");
      delCache(`${sellerId}:sellerStockBook:books`);

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


/**
 * For all Book that seller have in stock
 */

/**
 * @swagger
 * /book/api/v1/seller-stock-book:
 *   get:
*     tags:
*       - Books
*     summary: Get all books in the seller's stock.
 *     description: Retrieves all books that the seller has in stock.
 *     responses:
 *       200:
 *         description: Books successfully retrieved.
 *       400:
 *         description: Seller not found.
 *       404:
 *         description: No books found for the seller.
 *       500:
 *         description: Server error.
 */

// const sellerStockBook = async (req, res) => {
//   try {
//     const sellerId = req.cred.credDecode.sellerId;

//     const cacheKey = sellerId;
//     // Check if the data is already cached
//     const cachedData = getCache(cacheKey);
//     if (cachedData) {
//       return res.status(200).json({
//         success: true,
//         msg: `All Books from Seller ${sellerId}'s Stock.from cache`,
//         booksData: cachedData,
//       });
//     }

//     // Check if the seller exists
//     const sellerExists = await Seller.findOne({ sellerId: sellerId });
//     if (!sellerExists) {
//       return res.status(400).json({
//         success: false,
//         msg: `Seller with ID: ${sellerId} does not exist!`,
//       });
//     }

//     // Find books that have the seller in the spCluster array
//     const booksData = await Book.find({ "spCluster.sellerId": sellerId });

//     // Check if any books were found for the seller
//     if (booksData.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: `No books found for Seller: ${sellerId}.`,
//       });
//     }

//     // Store the processed data in cache
//     setCache(cacheKey, booksData);

//     // Respond with success and the list of books in stock for the seller
//     return res.status(200).json({
//       success: true,
//       msg: `All Books from Seller ${sellerId}'s Stock.`,
//       booksData: booksData,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       msg: error.message || "An error occurred while fetching the stock.",
//     });
//   }
// };

const sellerStockBook = async (req, res) => {
  try {
    const sellerId = req.cred.credDecode.sellerId;

    const cacheKey = `${sellerId}:sellerStockBook:books`;;

    // Check if the data is already cached
    const cachedData = await getCache(cacheKey); // Ensure this is awaited
    if (cachedData) {
      return res.status(200).json({
        success: true,
        msg: `All Books from Seller ${sellerId}'s Stock from cache`,
        booksData: JSON.parse(cachedData), // Parse the cached JSON data
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
    await setCache(cacheKey, booksData);  // Ensure this is awaited

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
 * Get all book Data from the Db  w.r.t there Genre APi
 * it is heavy task so better if you cache the data as soon as app is started so Work on this
 */
/**
 * @swagger
 * /book/api/v1/all-genre-book:
 *   get:
*     tags:
*       - Books
*     summary: Get all books grouped by genre.
 *     description: Retrieves all books from the database grouped by their genre.
 *     responses:
 *       200:
 *         description: Books grouped by genre successfully retrieved.
 *       400:
 *         description: An error occurred.
 *       500:
 *         description: Server error.
 */

// const bookAllGenreGoogleAPI = async (req, res) => {
//   try {
//     const cacheKey = "all_genre_books";
//     // Check if the data is already cached
//     const cachedData = getCache(cacheKey);
//     if (cachedData) {
//       return res.status(200).json({
//         success: true,
//         msg: "Books grouped by genre fetched from cache",
//         bookData: cachedData,
//       });
//     }

//     const genres = {};

//     const books = await Book.find({}, { _id: 0 });

//     // Iterate through each book and categorize them based on genres
//     books.forEach((book) => {
//       const { genre } = book;

//       // Iterate through each genre in the genre array
//       genre.forEach((g) => {
//         const lowerGenre = g.toLowerCase();

//         if (!genres[lowerGenre]) {
//           genres[lowerGenre] = [];
//         }
//         genres[lowerGenre].push(book);
//       });
//     });

//     // Store the processed data in cache
//     setCache(cacheKey, genres);

//     // Return success response with organized genre data
//     return res.status(200).json({
//       success: true,
//       msg: "Books grouped by genre successfully",
//       bookData: genres,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       success: false,
//       msg: error.message || "An error occurred",
//     });
//   }
// };

const bookAllGenreGoogleAPI = async (req, res) => {
  try {
    const cacheKey = "all_genre_books";

    // Check if the data is already cached
    const cachedData = await getCache(cacheKey); // Await Redis cache get
    if (cachedData) {
      return res.status(200).json({
        success: true,
        msg: "Books grouped by genre fetched from cache",
        bookData: JSON.parse(cachedData), // Parse cached data
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
    await setCache(cacheKey, genres);  // Await Redis cache set

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
 * Get all book Data from the Db Sorted by the specific  genre
 */
/**
 * @swagger
 * /book/api/v1/genre-book/{genre}:
 *   get:
*     tags:
*       - Books
*     summary: Get all books by genre.
 *     description: Retrieves all books from the database for a specific genre.
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         description: The genre to filter books by.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books successfully retrieved.
 *       400:
 *         description: Genre is required.
 *       404:
 *         description: No books found for the genre.
 *       500:
 *         description: Server error.
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

/**
 * @swagger
 * /book/api/v1/all-seller:
 *   get:
*     tags:
*       - Books
*     summary: Get all sellers.
 *     description: Retrieves all sellers with public information.
 *     responses:
 *       200:
 *         description: Sellers successfully retrieved.
 *       500:
 *         description: Server error.
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
/**
 * @swagger
 * /book/api/v1/books-by-seller/{sellerId}:
 *   get:
*     tags:
*       - Books
*     summary: Get all books by a seller.
 *     description: Retrieves all books that a specific seller is selling.
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         description: The ID of the seller.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller information and books successfully retrieved.
 *       404:
 *         description: Seller or books not found.
 *       500:
 *         description: Server error.
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

    // Modify spCluster to include only the matching seller's price & stock
    const filteredBooks = books.map((book) => {
      return {
        ...book._doc, // Spread original document
        spCluster: book.spCluster
          .filter((sp) => sp.sellerId === sellerId) // Keep only the matched seller
          .map(({ price, stock }) => ({ price, stock })), // Send only price & stock
      };
    });

    // Return the seller info and the filtered list of books
    return res.status(200).json({
      success: true,
      msg: `Seller information and books for sellerId ${sellerId}`,
      books: filteredBooks,
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

/**
 * @swagger
 * /book/api/v1/sellers-by-book/{isbn}:
 *   get:
*     tags:
*       - Books
*     summary: Get sellers for book
 *     description: Get all sellers that are selling a specific book by ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         description: ISBN of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book sellers found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                 book:
 *                 
 *                 sellers:
 *                   type: array
 *                 
 *       404:
 *         description: Book or sellers not found
 *       500:
 *         description: Server error
 */
const sellersByBook = async (req, res) => {
  try {
    const { isbn } = req.params;

    // Query to find the book by ISBN
    const books = await Book.find({ isbn });

    // Edge case: No books found for the given ISBN
    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No books found with ISBN ${isbn}`,
      });
    }

    // Extract unique seller IDs from the `spCluster` array
    const sellerIds = [];
    books.forEach((book) => {
      book.spCluster.forEach((cluster) => {
        if (cluster.sellerId && !sellerIds.includes(cluster.sellerId)) {
          sellerIds.push(cluster.sellerId);
        }
      });
    });

    // Query to find sellers by the extracted seller IDs
    const sellers = await Seller.find({ sellerId: { $in: sellerIds } });

    // Edge case: No sellers found for the given book
    if (sellers.length === 0) {
      return res.status(404).json({
        success: false,
        msg: `No sellers found for the book with ISBN ${isbn}`,
      });
    }

    // Query to get book data (only `data` field)
    const bookData = await Book.findOne({ isbn }).select("data");

    // Edge case: Book data is null or undefined (shouldn't happen if `books` query was successful)
    if (!bookData) {
      return res.status(404).json({
        success: false,
        msg: `Book data not found for ISBN ${isbn}`,
      });
    }

    // Success response with both sellers and book data
    return res.status(200).json({
      success: true,
      msg: `Sellers and book data fetched successfully for ISBN ${isbn}`,
      book: bookData.data,
      sellers,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching sellers by book",
    });
  }
};

/**
 * @swagger
 * /book/api/v1/{sellerId}:
 *   get:
*     tags:
*       - Books
*     summary: Get seller by ID
 *     description: Retrieve detailed information about a specific seller
 *     parameters:
 *       - in: path
 *         name: sellerId 
 *         required: true
 *         description: ID of the seller to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *               
 *                 
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */

const sellerById = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Query to find the seller by sellerId
    const seller = await Seller.findOne({ sellerId });

    // Edge case: No seller found for the given sellerId
    if (!seller) {
      return res.status(404).json({
        success: false,
        msg: `No seller found with ID ${sellerId}`,
      });
    }

    // Success response with the seller information
    return res.status(200).json({
      success: true,
      msg: `Seller information fetched successfully for seller ID ${sellerId}`,
      seller,
    });
  } catch (error) {
    // Handle any unexpected errors
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching seller by ID",
    });
  }
};



module.exports = {
  allSeller,
  booksBySeller,
  sellersByBook,

  addBookGoogleAPI,
  removeSellerFromBook,
  sellerStockBook,
  bookAllGenreGoogleAPI,
  bookByGenreGoogleAPI,
  sellerById
};
