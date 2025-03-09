const express = require("express");
const router = express();


//========================= Authentication Middleware

const authMiddleware = require("../middleware/auth-middleware");
//-------------------------------------------------------

//=========================  Router-Level Middleware CASL

const { checkAbility } = require("../middleware/casl-rbac/casl-abilities-check-middleware");
//------------------------------------------------------


const orderController = require("../controllers/order/order-controller");

const {
  orderBookValidator,
  cancelOrderValidator,
  sellerOrderListCheckValidator,
  userOrderListCheckValidator,
} = require("../helpers/validation/order-validation-helper");


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
