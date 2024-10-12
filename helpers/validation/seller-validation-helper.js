const { check, body } = require("express-validator");

exports.registerSellerValidator = [
  check(
    "password",
    "Password must be greater than 6 characters, and contains at least one uppercase letter, one lowercase letter,and one number,and one special character "
  ).isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }),
  check("name", "Name is requierd").not().isEmpty(),
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("storeName", "Store name is required").not().isEmpty(),
  check("storeDescription", "Store description is required").not().isEmpty(),
  check("storeImg").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Store image is required");
    }
    if (
      req.file.mimetype === "image/jpeg" ||
      req.file.mimetype === "image/png"
    ) {
      return true;
    } else {
      throw new Error("Please upload a valid image (jpeg, png)");
    }
  }),
  check("upiId", "UPI ID is required").not().isEmpty(),
  check("mobile", "Mobile Should Conation 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  check("gstNumber", "GST number is required").not().isEmpty(),
  check("address.street", "Street address is required").not().isEmpty(),
  check("address.city", "City is required").not().isEmpty(),
  check("address.state", "State is required").not().isEmpty(),
  check("address.country", "Country is required").not().isEmpty(),
  check("address.zipCode", "Zip code is required").not().isEmpty(),
];

exports.updateSellerProfileValidator = [
  check("storeName", "Store name is required").not().isEmpty(),
  check("storeDescription", "Store description is required").not().isEmpty(),
  check("image")
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        if (
          req.file.mimetype === "image/jpeg" ||
          req.file.mimetype === "image/png"
        ) {
          return true;
        } else {
          throw new Error("Please upload a valid image (jpeg, png)");
        }
      }
      return true;
    }),
  check("contactNumber", "Contact number should contain 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  check("gstNumber", "GST number is required").not().isEmpty(),
  check("address.street", "Street address is required").not().isEmpty(),
  check("address.city", "City is required").not().isEmpty(),
  check("address.state", "State is required").not().isEmpty(),
  check("address.country", "Country is required").not().isEmpty(),
  check("address.zipCode", "Zip code is required").not().isEmpty(),
];

exports.sendMailVerificationValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
];

exports.forgotPasswordValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
];

exports.loginValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),

  check("password", "Password is required!").not().isEmpty(),
];

exports.updateSellerProfileValidator = [
  // Individual checks for each field (all optional)
  check("name").optional().notEmpty().withMessage("Name should not be empty"),
  check("mobile")
    .optional()
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number should contain 10 digits"),
  check("storeName")
    .optional()
    .notEmpty()
    .withMessage("Store name should not be empty"),
  check("storeDescription")
    .optional()
    .notEmpty()
    .withMessage("Store description should not be empty"),
  check("image")
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        if (
          req.file.mimetype === "image/jpeg" ||
          req.file.mimetype === "image/png"
        ) {
          return true;
        } else {
          throw new Error("Please upload a valid image (jpeg, png)");
        }
      }
      return true;
    }),
  check("upiId")
    .optional()
    .notEmpty()
    .withMessage("UPI ID should not be empty"),
  check("address.street")
    .optional()
    .notEmpty()
    .withMessage("Street address should not be empty"),
  check("address.city")
    .optional()
    .notEmpty()
    .withMessage("City should not be empty"),
  check("address.state")
    .optional()
    .notEmpty()
    .withMessage("State should not be empty"),
  check("address.country")
    .optional()
    .notEmpty()
    .withMessage("Country should not be empty"),
  check("address.zipCode")
    .optional()
    .notEmpty()
    .withMessage("Zip code should not be empty"),
  check("gstNumber")
    .optional()
    .notEmpty()
    .withMessage("GST number should not be empty"),
  check("socialMediaLinks.facebook")
    .optional()
    .isURL()
    .withMessage("Invalid Facebook URL"),
  check("socialMediaLinks.instagram")
    .optional()
    .isURL()
    .withMessage("Invalid Instagram URL"),
  check("socialMediaLinks.linkedin")
    .optional()
    .isURL()
    .withMessage("Invalid LinkedIn URL"),

  // Custom validation to ensure at least one field is provided
  body().custom((value, { req }) => {
    // Check if any of the updatable fields are present in the request body
    const updateFields = [
      "name",
      "mobile",
      "storeName",
      "storeDescription",
      "image",
      "upiId",
      "address.street",
      "address.city",
      "address.state",
      "address.country",
      "address.zipCode",
      "gstNumber",
      "socialMediaLinks.facebook",
      "socialMediaLinks.instagram",
      "socialMediaLinks.linkedin",
    ];

    const isFieldPresent = updateFields.some((field) =>
      field.split(".").reduce((o, i) => (o ? o[i] : undefined), req.body)
    );

    if (!isFieldPresent) {
      throw new Error("At least one field must be updated.");
    }

    return true;
  }),
];
