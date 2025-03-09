const express = require("express");
const router = express();


//========================= Authentication Middleware

const authMiddleware = require("../../middleware/auth-middleware");
//-------------------------------------------------------




//-------------management controller
const managementController = require("../../controllers/management/management-controller");

//--------------cloud image upload
const uploadCloud = require("../../middleware/multer/multer-cloud-middleware");
const {
  uploadCloudSingle,
} = require("../../middleware/multer/multer-cloud-setup");


//-----------validator and authentication
const {
  registerMemberValidator,
  loginMemberValidator,
  updateMemberProfileValidator,
  forgotMemberPasswordValidator,
} = require("../../helpers/validation/management-validation-helper");


//********************* Routes**************************/

//------------ single img will be uploaded at cloud
// router.post(
//   "/management/api/v1/management/member-register",
//   uploadCloud.single("image"),
//   registerMemberValidator,
//   uploadCloudSingle,
//   managementController.memberRegister
// );

//--------------------- Forget Password

router.post(
  "/management/api/v1/management/forgot-password",
  forgotMemberPasswordValidator,
  managementController.forgotMemberPassword
);

//------------ To render reset password page
router.get(
  "/management/api/v1/management/reset-password",
  managementController.resetMemberPassword
);

//----------- To update new Password in Db
router.post(
  "/management/api/v1/management/reset-password",
  managementController.updateMemberPassword
);

//----------- to render success page
router.get(
  "/management/api/v1/management/reset-success",
  managementController.resetSuccess
);

//-------------------- Login
router.post(
  "/management/api/v1/management/member-login",
  loginMemberValidator,
  managementController.loginMember
);

//-------------------- User Profile
router.get(
  "/management/api/v1/management/member-profile",
  authMiddleware,
  managementController.memberProfile
);

//------------------- Update Profile
router.post(
  "/management/api/v1/management/update-member-profile",
  authMiddleware,
  uploadCloud.single("image"),
  updateMemberProfileValidator,
  managementController.updateMemberProfile
);

router.get(
  "/management/api/v1/management/refresh-token",
  authMiddleware,
  managementController.refreshToken
);

router.get(
  "/management/api/v1/management/logout-member",
  authMiddleware,
  managementController.logoutUser
);

module.exports = router;
