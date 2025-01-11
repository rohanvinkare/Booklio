const { check } = require("express-validator");

/**
 * check for adding new member
 */
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
];

exports.registerMemberValidatorV4 = [
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
];

exports.deleteUserValidator = [
  check("userId", "userId is required").not().isEmpty(),
];

exports.deleteSellerValidator = [
  check("sellerId", "sellerId is required").not().isEmpty(),
];

exports.deleteMemberValidator = [
  check("memberId", "memberId is required").not().isEmpty(),
];

/**
 * check for role updation and {role =! admin}
 */

exports.updateMemberRoleValidator = [
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("role", "Role is required").not().isEmpty(),
  check("role").custom((value) => {
    if (value === "admin") {
      throw new Error("Role cannot be updated to admin");
    }
    return true; // Indicates the value is valid
  }),
];


