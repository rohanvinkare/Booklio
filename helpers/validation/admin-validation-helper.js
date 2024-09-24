const { check } = require("express-validator");

exports.registerMemberValidator = [
  // Validate name
  check("name", "Name is required").not().isEmpty(),

  // Validate email
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),

  // Validate mobile number
  check("mobile", "Mobile should contain exactly 10 digits")
    .isLength({ min: 10, max: 10 })
    .isNumeric()
    .withMessage("Mobile number must be numeric"),

  // Validate password
  check(
    "password",
    "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  ).isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1, // Ensure at least one special character
  }),

  // Validate image
  check("image").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Image file is required");
    }
    const validMimeTypes = ["image/jpeg", "image/png"];
    if (!validMimeTypes.includes(req.file.mimetype)) {
      throw new Error("Please upload a valid image (jpeg or png)");
    }
    return true;
  }),
];

exports.loginMemberValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),

  check("password", "Password is required!").not().isEmpty(),
];

exports.updateMemberProfileValidator = [
  check("name", "Name is requierd").not().isEmpty(),
  check("mobile", "Mobile Should Conation 10 digits").isLength({
    min: 10,
    max: 10,
  }),
];


exports.forgotMemberPasswordValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
];