const express = require("express");
const router = express();

router.use(express.json());
//------------------ To reset the password
const bodyParser = require("body-parser");

// to accept data from the form
router.use(bodyParser.json());
// to accept data from the URL
router.use(bodyParser.urlencoded({ extended: true }));

const authMiddleware = require("../middleware/auth-middleware");

const orderController = require("../controllers/order/order-controller");

const {
  orderBookValidator,
  cancelOrderValidator,
  sellerOrderListCheckValidator,
  userOrderListCheckValidator,
} = require("../helpers/validation/order-validation-helper");

const {
  checkAbility,
} = require("../middleware/casl-rbac/casl-abilities-check-middleware");

//================================== For Seller ==================================

//------------------------------------ Book Add And Delete
router.post(
  "/order/api/v1/order-book",
  authMiddleware,
  // orderBookValidator,
  orderController.placeOrder
);

router.post(
  "/order/api/v1/cancel-order",
  authMiddleware,
  // cancelOrderValidator,
  orderController.cancelOrder
);

//----------- Get all orders for seller from users 
router.get("/order/seller-order-list/:sellerId",
  sellerOrderListCheckValidator,
  orderController.sellerOrderList);


  //---------- Get all orders of the user from sellers  where they order
router.get("/order/user-order-list/:userId",
  userOrderListCheckValidator,
  orderController.userOrderList
);


module.exports = router;
