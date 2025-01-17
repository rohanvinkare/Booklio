const express = require("express");
const router = express();
router.use(express.json());
const bodyParser = require("body-parser");
// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

const authMiddleware = require("../middleware/auth-middleware");
const uploadCloud = require("../middleware/multer/multer-cloud-middleware");

const {
  checkAbility,
} = require("../middleware/casl-rbac/casl-abilities-check-middleware");

const {
  uploadCloudSingle,
} = require("../middleware/multer/multer-cloud-setup");

const {
  registerSellerValidator,
  sendMailVerificationValidator,
  forgotPasswordValidator,
  loginValidator,
  updateSellerProfileValidator,
  registerSellerValidatorV4
} = require("../helpers/validation/seller-validation-helper");

const sellerController = require("../controllers/seller/seller-controller");

//-------------- Seller registration
router.post(
  "/seller/api/v1/register",
  uploadCloud.single("image"),
  registerSellerValidator,
  uploadCloudSingle,
  sellerController.sellerRegister
);

//---------- No Image 
router.post(
  "/seller/api/v4/register",
  registerSellerValidatorV4,
  sellerController.sellerRegisterV4
);

//-------------------- Mail Verification While Registering seller
router.get(
  "/seller/api/v1/mail-verification",
  sellerController.mailVerification
);

//------- Mail Verification After Registering if he missed at the time of registration
router.post(
  "/seller/api/v1/send-mail-verification",
  sendMailVerificationValidator,
  sellerController.sendMailVerification
);

//--------------------- Forget Password for Seller
router.post(
  "/seller/api/v1/forgot-password",
  forgotPasswordValidator,
  sellerController.forgotPassword
);

//------------ To render reset password page
router.get("/seller/api/v1/reset-password", sellerController.resetPassword);

//----------- To update new Password in Db
router.post("/seller/api/v1/reset-password", sellerController.updatePassword);

//-----------to render success page
router.get("/seller/api/v1/reset-success", sellerController.resetSuccess);

//-------------------- Login
router.post(
  "/seller/api/v1/login",
  loginValidator,
  sellerController.loginSeller
);

//--------------------Seller Profile
router.get(
  "/seller/api/v1/profile",
  authMiddleware,
  checkAbility("read", "seller-profile"),
  sellerController.sellerProfile
);

//-------------------- Cloud update for the user
router.post(
  "/seller/api/v1/update-profile",
  authMiddleware,
  checkAbility("update", "seller-profile"),
  uploadCloud.single("image"),
  updateSellerProfileValidator,
  uploadCloudSingle,
  sellerController.updateSellerProfile
);

router.get(
  "/seller/api/v1/refresh-token",
  authMiddleware,
  sellerController.refreshToken
);

router.get(
  "/seller/api/v1/logout",
  authMiddleware,
  checkAbility("logout", "seller-logout"),
  sellerController.logoutSeller
);

module.exports = router;
