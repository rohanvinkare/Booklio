const express = require("express");
const router = express();

router.use(express.json());
//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

const managementController = require("../../controllers/management/management-controller");
const uploadCloud = require("../../middleware/multer/multer-cloud-middleware");
const {
  uploadCloudSingle,
} = require("../../middleware/multer/multer-cloud-setup");

const {
  registerMemberValidator,
  loginMemberValidator,
  updateMemberProfileValidator,
  forgotMemberPasswordValidator,
} = require("../../helpers/validation/admin-validation-helper");

const authMiddleware = require("../../middleware/auth-middleware");

//------------ single img will be uploaded at cloud
router.post(
  "/api/v1/management/member-register",
  uploadCloud.single("image"),
  registerMemberValidator,
  uploadCloudSingle,
  managementController.memberRegister
);

//--------------------- Forget Password

router.post(
  "/api/v1/management/forgot-password",
  forgotMemberPasswordValidator,
  managementController.forgotMemberPassword
);

//------------ To render reset password page
router.get(
  "/api/v1/management/reset-password",
  managementController.resetMemberPassword
);

//----------- To update new Password in Db
router.post(
  "/api/v1/management/reset-password",
  managementController.updateMemberPassword
);

//----------- to render success page
router.get(
  "/api/v1/management/reset-success",
  managementController.resetSuccess
);

//-------------------- Login
router.post(
  "/api/v1/management/member-login",
  loginMemberValidator,
  managementController.loginMember
);

//-------------------- User Profile
router.get(
  "/api/v1/management/member-profile",
  authMiddleware,
  managementController.memberProfile
);

//------------------- Update Profile
router.post(
  "/api/v1/management/update-member-profile",
  authMiddleware,
  uploadCloud.single("image"),
  updateMemberProfileValidator,
  managementController.updateMemberProfile
);

router.get(
  "/api/v1/management/refresh-token",
  authMiddleware,
  managementController.refreshToken
);

router.get(
  "/api/v1/management/logout-member",
  authMiddleware,
  managementController.logoutUser
);

module.exports = router;
