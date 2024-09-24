const express = require("express");
const router = express();

router.use(express.json());
//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

//-------------admin controller
/**
 * Handles all the Controllers of the admin
 */
const adminController = require("../../../controllers/management/admin/admin-controller");

//--------------cloud image upload
const uploadCloud = require("../../../middleware/multer/multer-cloud-middleware");
const {
  uploadCloudSingle,
} = require("../../../middleware/multer/multer-cloud-setup");

//-----------validator and authentication
const {
  registerMemberValidator,
  deleteUserValidator,
  deleteMemberValidator,
  deleteSellerValidator,
  updateMemberRoleValidator,
} = require("../../../helpers/validation/admin-validation-helper");

const authMiddleware = require("../../../middleware/auth-middleware");

//********************* Routes**************************/

//------------ single img will be uploaded at cloud
router.post(
  "/api/v1/management/member-register",
  authMiddleware,
  uploadCloud.single("image"),
  registerMemberValidator,
  uploadCloudSingle,
  adminController.memberRegister
);

//------------ To delete the user
router.post(
  "/api/v1/delete-user",
  authMiddleware,
  deleteUserValidator,
  adminController.deleteUser
);

//------------ To delete the Seller
router.post(
  "/api/v1/delete-seller",
  authMiddleware,
  deleteSellerValidator,
  adminController.deleteSeller
);

//------------ To delete the Member
router.post(
  "/api/v1/delete-member",
  authMiddleware,
  deleteMemberValidator,
  adminController.deleteMember
);

//------------ To update the Member role
router.post(
  "/api/v1/update-member-role",
  authMiddleware,
  updateMemberRoleValidator,
  adminController.updateMemberRole
);

//----------- To All Member or member by memberId
router.get(
  "/api/v1/get-member-data/:memberId?",
  authMiddleware,
  adminController.getMemberData
);

//----------- To get All the Users of the website
router.get(
  "/api/v1/get-user-data/:userId?",
  authMiddleware,
  adminController.getUserData
);

//----------- To get All the Sellers of the website
router.get(
  "/api/v1/get-seller-data/:sellerId?",
  authMiddleware,
  adminController.getSellerData
);

//----------- To get All the Sellers of the website
router.get(
  "/api/v1/get-batch-data",
  authMiddleware,
  adminController.getAllData
);

module.exports = router;
