const express = require("express");
const router = express();

router.use(express.json());
const bookController = require('../controllers/book-controller');

const authMiddleware = require("../middleware/auth-middleware");

router.get("/api/v1/books/:genre", bookController.booksSearch);

router.get("/api/v1/books/works/:key", bookController.getBookData)

module.exports = router;    