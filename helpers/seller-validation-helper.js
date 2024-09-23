const { check } = require("express-validator");

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

exports.updateSellerUpiValidator = [
  check("upiId", "UPI ID is required").not().isEmpty(),
];

exports.updateSellerSocialLinksValidator = [
  check("socialMediaLinks.facebook", "Invalid Facebook URL").optional().isURL(),
  check("socialMediaLinks.instagram", "Invalid Instagram URL")
    .optional()
    .isURL(),
  check("socialMediaLinks.linkedIn", "Invalid LinkedIn URL").optional().isURL(),
];
