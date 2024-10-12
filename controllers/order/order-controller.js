const Book = require("../../models/books/books-model");
const Seller = require("../../models/seller/seller-model");
const User = require("../../models/user/user-model");
const Order = require("../../models/orders/orders-model");
const { validationResult } = require("express-validator");

//----------------------------------- To Place The Order
/**
 * To place the order
 */
const placeOrder = async (req, res) => {
  try {
    // Validating the request with express validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Errors",
        error: valErrors.array(),
      });
    }

    // Decode userId from the token
    const userId = req.cred.credDecode.userId; // Extracting userId from the request

    // Get sellerId, isbn, and shippingAddress from request body
    const { sellerId, isbn, shippingAddress } = req.body;

    // Find the book by ISBN
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({
        success: false,
        msg: "Book not found",
      });
    }

    // Create a new order
    const newOrder = new Order({
      isbn: book.isbn,
      price: book.price, // Price at the time of order
      userId: userId,
      sellerId: sellerId,
      shippingAddress: shippingAddress,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Return success response
    return res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(400).json({
      success: false,
      msg: error.message || "An error occurred while placing the order",
    });
  }
};

//----------------------------------- To Cancel The Order
/**
 * To Cancel the order means changing the status to canceled entry will not be deleted
 */
const cancelOrder = async (req, res) => {
  try {
    // Validate the request
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: valErrors.array(),
      });
    }

    // Get orderId from request body
    const { orderId } = req.body;

    // Find the order by orderId
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        msg: `Order with ID ${orderId} does not exist!`,
      });
    }

    // Check if the order status is already canceled
    if (order.status === "canceled") {
      return res.status(400).json({
        success: false,
        msg: `Order with ID ${orderId} is already canceled!`,
      });
    }

    // Cancel the order
    order.status = "canceled";
    await order.save();

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Order with ID ${orderId} has been canceled successfully.`,
      order: order, // Optionally return the updated order details
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while canceling the order.",
    });
  }
};

module.exports = { placeOrder, cancelOrder };
