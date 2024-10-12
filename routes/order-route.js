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
} = require("../helpers/validation/order-validation-helper");

const {
  checkAbility,
} = require("../middleware/casl-rbac/casl-abilities-check-middleware");

//================================== For Seller ==================================

//------------------------------------ Book Add And Delete
router.post(
  "/api/v1/order-book",
  authMiddleware,
  orderBookValidator,
  orderController.placeOrder
);

router.post(
  "/api/v1/cancel-order",
  authMiddleware,
  cancelOrderValidator,
  orderController.cancelOrder
);

module.exports = router;
