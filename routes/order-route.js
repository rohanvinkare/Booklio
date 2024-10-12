const express = require("express");
const router = express();

router.use(express.json());
//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

const authMiddleware = require("../middleware/auth-middleware");

const orderController = require("../controllers/order/order-controller");

const {
  orderBookValidator,
  cancelOrderValidator,
} = require("../helpers/validation/order-validation-helper");

const {
  checkAbility,
} = require("../middleware/casl-rbac/casl-abilities-check-middleware");

//================================== For Seller ==================================

//------------------------------------ Book Add And Delete
router.post(
  "/api/v1/order-book",
  authMiddleware,
  orderBookValidator,
  orderController.placeOrder
);

router.post(
  "/api/v1/cancel-order",
  authMiddleware,
  cancelOrderValidator,
  orderController.cancelOrder
);

// //---------------------------------  Get all Books that  Seller has in Stock
// router.get(
//   "/api/v1/seller-stock-book",
//   authMiddleware,
//   orderController.stockBook
// );

// //------------------------------- Get all Books For the user or gest

// router.get("/api/v1/all-genre-book");

// //--------- Get all books in the genre
// router.get("/api/v1/genre-book/:genre");

// //----------Get all the sellers
// router.get("/api/v1/all-seller");

// //-----------Get the specific seller info and the book he is selling
// router.get("/api/v1/books-by-seller/:sellerId");

// //----------Get the all the sellers selling the book
// router.get("/api/v1/sellers-by-book/:isbn");

module.exports = router;
