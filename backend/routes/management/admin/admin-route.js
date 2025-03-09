const express = require("express");
const router = express();


//========================= Authentication Middleware

const authMiddleware = require("../../../middleware/auth-middleware");
//-------------------------------------------------------


//=========================  Router-Level Middleware CASL

const { checkAbility } = require("../../../middleware/casl-rbac/casl-abilities-check-middleware");
//------------------------------------------------------


const adminController = require("../../../controllers/management/admin/admin-controller");

//--------------cloud image upload
const uploadCloud = require("../../../middleware/multer/multer-cloud-middleware");
const { uploadCloudSingle } = require("../../../middleware/multer/multer-cloud-setup");

//-----------validator and authentication
const {
  registerMemberValidator,
  deleteUserValidator,
  deleteMemberValidator,
  deleteSellerValidator,
  updateMemberRoleValidator,
  registerMemberValidatorV4,
} = require("../../../helpers/validation/admin-validation-helper");



//********************* Routes**************************/
//------------ single img will be uploaded at cloud
router.post(
  "/admin/api/v1/management/member-register",
  authMiddleware,
  checkAbility("create", "member"),
  uploadCloud.single("image"),
  registerMemberValidator,
  uploadCloudSingle,
  adminController.memberRegister
);

router.post(
  "/admin/api/v4/management/member-register",
  authMiddleware,
  // checkAbility("create", "member"),
  registerMemberValidatorV4,
  adminController.memberRegisterV4
);
//------------ To delete the user
router.post(
  "/admin/api/v1/delete-user",
  authMiddleware,
  checkAbility("delete", "user"),
  deleteUserValidator,
  adminController.deleteUser
);

//------------ To delete the Seller
router.post(
  "/admin/api/v1/delete-seller",
  authMiddleware,
  // checkAbility("delete", "seller"),
  // deleteSellerValidator,
  adminController.deleteSeller
);

//------------ To delete the Member
router.post(
  "/admin/api/v1/delete-member",
  authMiddleware,
  // checkAbility("delete", "member"),
  // deleteMemberValidator,
  adminController.deleteMember
);

//------------ To update the Member role
router.post(
  "/admin/api/v1/update-member-role",
  authMiddleware,
  checkAbility("update", "member"),
  updateMemberRoleValidator,
  adminController.updateMemberRole
);

//----------- To All Member or member by memberId
router.get(
  "/admin/api/v1/get-member-data/:memberId?",
  // authMiddleware,
  // checkAbility("read", "members"),
  adminController.getMemberData
);

//----------- To get All the Users of the website
router.get(
  "/admin/api/v1/get-user-data/:userId?",
  // authMiddleware,
  // checkAbility("read", "users"),
  adminController.getUserData
);

//----------- To get All the Sellers of the website
router.get(
  "/admin/api/v1/get-seller-data/:sellerId?",
  // authMiddleware,
  // checkAbility("read", "sellers"),
  adminController.getSellerData
);

//----------- To get All the folks of the website
router.get(
  "/admin/api/v1/get-batch-data",
  // authMiddleware,
  // checkAbility("read", "Batch-Data"),
  adminController.getAllData
);


//-----------  To get all Paycut data for Admin

router.get("/admin/api/v1/paycut",
  adminController.paycutFunc
)

module.exports = router;
