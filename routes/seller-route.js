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
} = require("../helpers/seller-validation-helper");
const sellerController = require("../controllers/seller-controller");

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

module.exports = router;
