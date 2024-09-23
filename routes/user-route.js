const express = require("express");
const router = express();

router.use(express.json());
const userController = require("../controllers/user-controller");

const uploadServer = require("../middleware/multer/multer-server-middleware");
const uploadCloud = require("../middleware/multer/multer-cloud-middleware");

const authMiddleware = require("../middleware/auth-middleware");

const {
  registerValidator,
  sendMailVerificationValidator,
  forgotPasswordValidator,
  loginValidator,
  updateProfileValidator,
} = require("../helpers/user-validation-helper");

//------------------------------------ Register

//--------- img will be uploaded to server
router.post(
  "/api/v1/register",
  uploadServer.single("image"),
  registerValidator,
  userController.userRegister
);

const {
  uploadCloudMultiple,
  uploadCloudSingle,
} = require("../middleware/multer/multer-cloud-setup");

//--------- single img will be uploaded at cloud
router.post(
  "/api/v2/register",
  uploadCloud.single("image"),
  registerValidator,
  uploadCloudSingle,
  userController.userRegister
);

//-------- multiple images will be uploaded at cloud
//-------- not to use not set up in db and controller
router.post(
  "/api/v3/register",
  uploadCloud.array("images"),
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
  uploadServer.single("image"),
  updateProfileValidator,
  userController.updateProfile
);

// cloud update for the user
router.post(
  "/api/v2/update-profile",
  authMiddleware,
  uploadCloud.single("image"),
  updateProfileValidator,
  uploadCloudSingle,
  userController.updateProfile
);

router.get(
  "/api/v1/refresh-token",
  authMiddleware,
  userController.refreshToken
);

router.get("/api/v1/logout", authMiddleware, userController.logoutUser);

module.exports = router;
