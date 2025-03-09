const express = require("express");
const router = express();

//========================= Authentication Middleware

const authMiddleware = require("../middleware/auth-middleware");
//-------------------------------------------------------

//=========================  Router-Level Middleware CASL

const { checkAbility } = require("../middleware/casl-rbac/casl-abilities-check-middleware");
//------------------------------------------------------


//========================= Router-Level Middleware
const rateLimit = require("express-rate-limit");

// Limit requests to 50 per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per windowMs
  message: "Too many requests, please try again after a minute.",
});
//------------------------------------------------------


const userController = require("../controllers/user/user-controller");
const uploadServer = require("../middleware/multer/multer-server-middleware");
const uploadCloud = require("../middleware/multer/multer-cloud-middleware");


const {
  registerValidator,
  sendMailVerificationValidator,
  forgotPasswordValidator,
  loginValidator,
  updateProfileValidator,
  registerValidatorV4
} = require("../helpers/validation/user-validation-helper");



//------------------------------------ Register

//--------- img will be uploaded to server

router.post(
  "/user/api/v2/register",
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
  "/user/api/v1/register",
  uploadCloud.single("image"),
  registerValidator,
  uploadCloudSingle,
  userController.userRegister
);

//--------- Without Image Upload 
router.post(
  "/user/api/v4/register",
  registerValidatorV4,
  userController.userRegisterV4
);


//-------- multiple images will be uploaded at cloud
//-------- not to use not set up in db and controller
router.post(
  "/user/api/v3/register",
  uploadCloud.array("images"),
  registerValidator,
  userController.userRegister
);

//-------------------- Mail Verification While Registering
router.get("/user/api/v1/mail-verification", userController.mailVerification);

//------- Mail Verification After Registering if he missed at the time of registration
router.post(
  "/user/api/v1/send-mail-verification",
  sendMailVerificationValidator,
  userController.sendMailVerification
);

//--------------------- Forget Password

router.post(
  "/user/api/v1/forgot-password",
  forgotPasswordValidator,
  userController.forgotPassword
);

//------------ To render reset password page
router.get("/user/api/v1/reset-password", userController.resetPassword);

//----------- To update new Password in Db
router.post("/user/api/v1/reset-password", userController.updatePassword);

//----------- to render success page
router.get("/user/api/v1/reset-success", userController.resetSuccess);

//-------------------- Login
router.post("/user/api/v1/login", limiter, loginValidator, userController.loginUser);

//--------------------User Profile
router.get(
  "/user/api/v1/profile",
  authMiddleware,
  checkAbility("read", "uer-profile"),
  userController.userProfile
);

//------------------- Update Profile
router.post(
  "/user/api/v2/update-profile",
  authMiddleware,
  checkAbility("update", "user-profile"),
  uploadServer.single("image"),
  updateProfileValidator,
  userController.updateProfile
);

// cloud update for the user
router.post(
  "/user/api/v1/update-profile",
  authMiddleware,
  checkAbility("update", "user-profile"),
  uploadCloud.single("image"),
  updateProfileValidator,
  uploadCloudSingle,
  userController.updateProfile
);

router.get(
  "/user/api/v1/refresh-token",
  authMiddleware,
  userController.refreshToken
);

router.get(
  "/user/api/v1/logout",
  authMiddleware,
  checkAbility("logout", "user-logout"),
  userController.logoutUser
);

module.exports = router;
