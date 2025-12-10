const express = require("express");
const router = express();


const bookController = require("../controllers/book/book-controller");

//========================= Authentication Middleware

const authMiddleware = require("../middleware/auth-middleware");
//-------------------------------------------------------

//=========================  Router-Level Middleware CASL
const { checkAbility } = require("../middleware/casl-rbac/casl-abilities-check-middleware");
//------------------------------------------------------



const {
  addBookValidator,
  removeBookValidator,
  addBookValidatorGoogleAPI,
} = require("../helpers/validation/book-validation-helper");

//================================== For Seller ==================================

//------------------------------------ Book Add And Delete

router.post(
  "/book/api/v1/add-book",
  authMiddleware,
  
  bookController.addBookGoogleAPI
);

router.post(
  "/book/api/v1/remove-book",
  authMiddleware,
  // removeBookValidator,
  bookController.removeSellerFromBook
);

//-------------------------  Get all Books that  Seller has in Stock

router.get(
  "/book/api/v1/seller-stock-book",
  authMiddleware,
  bookController.sellerStockBook
);

//------------------------------- Get all Books For the user or gest

router.get("/book/api/v1/all-genre-book", bookController.bookAllGenreGoogleAPI);

//--------- Get all books in the genre

router.get("/book/api/v1/genre-book/:genre", bookController.bookByGenreGoogleAPI);

//----------Get all the sellers
router.get("/book/api/v1/all-seller", bookController.allSeller);

//-----------Get the specific seller info and the book he is selling
router.get("/book/api/v1/books-by-seller/:sellerId", bookController.booksBySeller);


//-----------Get the specific seller info and the price he is selling with book
router.get("/book/api/v1/books-by-seller/:sellerId/:isbn", bookController.booksBySellerWithPrice);

//----------Get the all the sellers selling the book
router.get("/book/api/v1/sellers-by-book/:isbn", bookController.sellersByBook);



router.get("/book/api/v1/:sellerId", bookController.sellerById);


module.exports = router;
