const { check } = require("express-validator");

// exports.addBookValidator = [
//   check("genre")
//     .notEmpty()
//     .withMessage("Genre is required.")
//     .isString()
//     .withMessage("Genre must be a string."),

//   check("isbn")
//     .notEmpty()
//     .withMessage("ISBN is required.")
//     .isString()
//     .withMessage("ISBN must be a valid string.")
//     .isLength({ min: 10, max: 13 })
//     .withMessage("ISBN must be 10 or 13 characters long."),

//   check("price")
//     .notEmpty()
//     .withMessage("Price is required.")
//     .isString()
//     .withMessage("Genre must be a string."),
// ];

// exports.removeBookValidator = [
//   check("isbn")
//     .notEmpty()
//     .withMessage("ISBN is required.")
//     .isString()
//     .isLength({ min: 10, max: 13 })
//     .withMessage("ISBN must be 10 or 13 long."),
// ];

exports.addBookValidatorGoogleAPI = [
  check("isbn")
    .notEmpty()
    .withMessage("ISBN is required.")
    .isString()
    .withMessage("ISBN must be a valid string.")
    .isLength({ min: 10, max: 13 })
    .withMessage("ISBN must be 10 or 13 characters long."),
];
