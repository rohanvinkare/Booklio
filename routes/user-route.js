const express = require("express");
const router = express();

router.use(express.json());
//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

const userController = require("../controllers/user/user-controller");

const uploadServer = require("../middleware/multer/multer-server-middleware");
const uploadCloud = require("../middleware/multer/multer-cloud-middleware");

const authMiddleware = require("../middleware/auth-middleware");

const {
  registerValidator,
  sendMailVerificationValidator,
  forgotPasswordValidator,
  loginValidator,
  updateProfileValidator,
} = require("../helpers/validation/user-validation-helper");

const {
  checkAbility,
} = require("../middleware/casl-rbac/casl-abilities-check-middleware");

//------------------------------------ Register

//--------- img will be uploaded to server
router.post(
  "/api/v2/register",
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
  "/api/v1/register",
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

//------- Mail Verification After Registering if he missed at the time of registration
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

//------------ To render reset password page
router.get("/api/v1/reset-password", userController.resetPassword);

//----------- To update new Password in Db
router.post("/api/v1/reset-password", userController.updatePassword);

//----------- to render success page
router.get("/api/v1/reset-success", userController.resetSuccess);

//-------------------- Login
router.post("/api/v1/login", loginValidator, userController.loginUser);

//--------------------User Profile
router.get(
  "/api/v1/profile",
  authMiddleware,
  checkAbility("read", "uer-profile"),
  userController.userProfile
);

//------------------- Update Profile
router.post(
  "/api/v2/update-profile",
  authMiddleware,
  checkAbility("update", "user-profile"),
  uploadServer.single("image"),
  updateProfileValidator,
  userController.updateProfile
);

// cloud update for the user
router.post(
  "/api/v1/update-profile",
  authMiddleware,
  checkAbility("update", "user-profile"),
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

router.get(
  "/api/v1/logout",
  authMiddleware,
  checkAbility("logout", "user-logout"),
  userController.logoutUser
);

module.exports = router;
