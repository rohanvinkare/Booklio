const express = require("express");
const router = express();

router.use(express.json());

//----------------Setup For Multer------------

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, path.join(__dirname, "../public/images"));
      // cb --> call back
    }
  },

  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//-------------------------------------------------

const userController = require("../controllers/user-controller");
const authMiddleware = require("../middleware/auth-middleware");

const {
  registerValidator,
  sendMailVerificationValidator,
  forgotPasswordValidator,
  loginValidator,
  updateProfileValidator,
} = require("../helpers/validation-helper");

//-------------------- Register
router.post(
  "/api/v1/register",
  upload.single("image"),
  registerValidator,
  userController.userRegister
);

//-------------------- Mail Verification While Registering
router.get("/api/v1/mail-verification", userController.mailVerification);

//-------------------- Mail Verification After Registering
router.post(
  "/api/v1/send-mail-verification",
  sendMailVerificationValidator,
  userController.sendMailVerification
);

//--------------------- Forget Password

router.post(
  "/api/v1/forgot-password",
  forgotPasswordValidator,
  userController.forgotPassword
);

//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/api/v1/reset-password", userController.resetPassword);
router.post("/api/v1/reset-password", userController.updatePassword);
router.get("/api/v1/reset-success", userController.resetSuccess);

router.post("/api/v1/login", loginValidator, userController.loginUser);

router.get("/api/v1/profile", authMiddleware, userController.userProfile);

router.post(
  "/api/v1/update-profile",
  authMiddleware,
  upload.single("image"),
  updateProfileValidator,
  userController.updateProfile
);

module.exports = router;
