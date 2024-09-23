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
  uploadCloudSingle,
} = require("../middleware/multer/multer-cloud-setup");

const {
  registerSellerValidator,
  sendMailVerificationValidator,
  forgotPasswordValidator,
} = require("../helpers/seller-validation-helper");
const sellerController = require("../controllers/seller-controller");

//-------------- Seller registration
router.post(
  "/api/v1/seller/register",
  uploadCloud.single("image"),
  registerSellerValidator,
  uploadCloudSingle,
  sellerController.sellerRegister
);

//-------------------- Mail Verification While Registering seller
router.get(
  "/api/v1/seller/mail-verification",
  sellerController.mailVerification
);

//------- Mail Verification After Registering if he missed at the time of registration
router.post(
  "/api/v1/seller/send-mail-verification",
  sendMailVerificationValidator,
  sellerController.sendMailVerification
);

//--------------------- Forget Password for Seller
router.post(
  "/api/v1/seller/forgot-password",
  forgotPasswordValidator,
  sellerController.forgotPassword
);

//------------ To render reset password page
router.get("/api/v1/seller/reset-password", sellerController.resetPassword);

//----------- To update new Password in Db
router.post("/api/v1/seller/reset-password", sellerController.updatePassword);

//-----------to render success page
router.get("/api/v1/seller/reset-success", sellerController.resetSuccess);

module.exports = router;
