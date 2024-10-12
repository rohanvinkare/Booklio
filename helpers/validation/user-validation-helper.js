const { check } = require("express-validator");

exports.registerValidator = [
  check("name", "Name is requierd").not().isEmpty(),
  check("email", "Please include a valid email").isEmail().normalizeEmail({
    gmail_remove_dots: true,
  }),
  check("mobile", "Mobile Should Conation 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  check(
    "password",
    "Password must be greater than 6 characters, and contains at least one uppercase letter, one lowercase letter,and one number,and one special character "
  ).isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }),
  check("image")
    .custom((value, { req }) => {
      if (
        req.file.mimetype === "image/jpeg" ||
        req.file.mimetype === "image/png"
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("Please upload valid image jpeg, png"),
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

exports.updateProfileValidator = [
  check("name", "Name is requierd").not().isEmpty(),
  check("mobile", "Mobile Should Conation 10 digits").isLength({
    min: 10,
    max: 10,
  }),
];
