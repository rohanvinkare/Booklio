const { check } = require("express-validator");

exports.orderBookValidator = [
  check("sellerId")
    .notEmpty()
    .withMessage("Seller ID is required.")
    .isString()
    .withMessage("Seller ID must be a string."),

  check("isbn")
    .notEmpty()
    .withMessage("ISBN is required.")
    .isString()
    .withMessage("ISBN must be a string."),

  check("shippingAddress")
    .isObject()
    .withMessage("Shipping address must be an object.")
    .custom((value) => {
      // Validate required fields in shippingAddress
      const { street, city, state, country, zipCode } = value;
      if (!street) throw new Error("Street address is required.");
      if (!city) throw new Error("City is required.");
      if (!state) throw new Error("State is required.");
      if (!country) throw new Error("Country is required.");
      if (!zipCode) throw new Error("Zip code is required.");
      return true; // Indicates the validation passed
    }),
];

exports.cancelOrderValidator = [
  check("orderId")
    .exists()
    .withMessage("Order ID is required")
    .isString()
    .withMessage("Order ID must be a string"),
];
