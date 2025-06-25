const Book = require("../../models/books/books-model");
const Seller = require("../../models/seller/seller-model");
const User = require("../../models/user/user-model");
const Order = require("../../models/orders/orders-model");
const { validationResult } = require("express-validator");
const PayCut = require("../../models/paycut/paycut-model")
const { find } = require("../../models/blacklist-model");
require("dotenv").config();


/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Operations related to Orders
 */


//----------------------------------- To Place The Order
/**
 * To place the order
 */

// /**
//  * @swagger
//  * /order/api/v1/order-book:
//  *   post:
//  *     summary: Place an order for a book
//  *     description: Allows users to place an order by providing seller ID, book ISBN, and shipping address.
//  *     tags: [Order]
//  *     security:
//  *       - BearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               sellerId:
//  *                 type: string
//  *                 description: ID of the seller
//  *               isbn:
//  *                 type: string
//  *                 description: ISBN of the book
//  *               shippingAddress:
//  *                 type: string
//  *                 description: Shipping address for the order
//  *     responses:
//  *       201:
//  *         description: Order placed successfully
//  *       400:
//  *         description: Validation errors
//  *       404:
//  *         description: Book or seller not found
//  *       500:
//  *         description: Server error
//  */
// // const placeOrder = async (req, res) => {
// //   try {

// //     // Validating the request with express-validator
// //     const valErrors = validationResult(req);
// //     if (!valErrors.isEmpty()) {
// //       return res.status(400).json({
// //         success: false,
// //         msg: "Validation errors",
// //         error: valErrors.array(),
// //       });
// //     }

// //     // Decode userId from the token
// //     const userId = req.cred.credDecode.userId;

// //     // Extracting sellerId, isbn, and shippingAddress from request body
// //     const { sellerId, isbn, shippingAddress } = req.body;

// //     // Find the book by ISBN
// //     const book = await Book.findOne({ isbn });
// //     if (!book) {
// //       return res.status(404).json({
// //         success: false,
// //         msg: "Book not found",
// //       });
// //     }

// //     // Find the book price for the given seller
// //     const bookPrice = book.spCluster.find((element) => element.sellerId === sellerId);
// //     if (!bookPrice) {
// //       return res.status(404).json({
// //         success: false,
// //         msg: "Price not found for the given seller",
// //       });
// //     }

// //     // Create a new order
// //     const newOrder = new Order({
// //       isbn: book.isbn,
// //       price: bookPrice.price,
// //       userId: userId,
// //       sellerId: sellerId,
// //       shippingAddress: shippingAddress,
// //     });

// //     // Save the order to the database
// //     const savedOrder = await newOrder.save();

// //     // Calculate the 5% payCut from the order price
// //     const payCutAmount = (bookPrice.price * process.env.PAY_CUT_PERCENTAGE) / 100;

// //     // Create a new payCut entry
// //     const newPayCut = new PayCut({
// //       orderId: savedOrder.orderId,
// //       payCut: payCutAmount,
// //       status: savedOrder.status,
// //     });

// //     // Save the payCut entry to the database
// //     await newPayCut.save();

// //     // Return success response
// //     return res.status(201).json({
// //       success: true,
// //       msg: "Order placed successfully",
// //       order: savedOrder,
// //     });
// //   } catch (error) {
// //     console.error("Error placing order:", error);
// //     return res.status(500).json({
// //       success: false,
// //       msg: error.message || "An error occurred while placing the order",
// //     });
// //   }
// // };



/**
 * @swagger
 * /order/api/v1/order-book:
 *   post:
 *     summary: Place an order for a book
 *     description: Allows users to place an order by providing seller ID, book ISBN, quantity, and shipping address.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sellerId
 *               - isbn
 *               - quantity
 *               - shippingAddress
 *             properties:
 *               sellerId:
 *                 type: string
 *                 description: ID of the seller
 *               isbn:
 *                 type: string
 *                 description: ISBN of the book
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Number of copies to order
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address for the order
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 msg:
 *                   type: string
 *                 order:
 *                   type: object
 *                   description: Details of the placed order
 *                 remainingStock:
 *                   type: integer
 *                   description: Remaining stock after the order is placed
 *       400:
 *         description: Validation errors or insufficient stock
 *       404:
 *         description: Book or seller not found
 *       500:
 *         description: Server error
 */

const placeOrder = async (req, res) => {
  try {
    // Validating the request with express-validator
    const valErrors = validationResult(req);
    if (!valErrors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        error: valErrors.array(),
      });
    }

    // Decode userId from the token
    const userId = req.cred.credDecode.userId;

    // Extract sellerId, isbn, quantity, and shippingAddress from request body
    const { sellerId, isbn, quantity, shippingAddress } = req.body;

    // Validate quantity (must be at least 1)
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        msg: "Invalid quantity. Must be at least 1.",
      });
    }

    // Find the book by ISBN
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({
        success: false,
        msg: "Book not found",
      });
    }

    // Find the book price and stock for the given seller
    const sellerEntry = book.spCluster.find((element) => element.sellerId === sellerId);
    if (!sellerEntry) {
      return res.status(404).json({
        success: false,
        msg: "Seller not found for this book",
      });
    }

    // Check stock availability for the requested quantity
    if (sellerEntry.stock < quantity) {
      return res.status(400).json({
        success: false,
        msg: `Only ${sellerEntry.stock} copies available, but ${quantity} requested.`,
      });
    }

    // Reduce stock count atomically
    const updatedBook = await Book.findOneAndUpdate(
      { isbn, "spCluster.sellerId": sellerId },
      { $inc: { "spCluster.$.stock": -quantity } }, // Reduce stock by requested quantity
      { new: true }
    );

    if (!updatedBook) {
      return res.status(500).json({
        success: false,
        msg: "Error updating stock. Try again later.",
      });
    }

    // Create a new order
    const newOrder = new Order({
      isbn: book.isbn,
      price: sellerEntry.price * quantity, // Calculate total price
      userId: userId,
      sellerId: sellerId,
      quantity: quantity,
      shippingAddress: shippingAddress,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Calculate the 5% payCut from the total order price
    const payCutAmount = (savedOrder.price * process.env.PAY_CUT_PERCENTAGE) / 100;

    // Create a new payCut entry
    const newPayCut = new PayCut({
      orderId: savedOrder.orderId,
      payCut: payCutAmount,
      status: savedOrder.status,
    });

    // Save the payCut entry to the database
    await newPayCut.save();

    // Return success response
    return res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      order: savedOrder,
      remainingStock: updatedBook.spCluster.find((el) => el.sellerId === sellerId).stock, // Return updated stock count
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while placing the order.",
    });
  }
};



//----------------------------------- To Cancel The Order
/**
 * To Cancel the order means changing the status to cancelled entry will not be deleted
 */

/**
 * @swagger
 * /order/api/v1/cancel-order:
 *   post:
 *     summary: Cancel an order
 *     description: Updates the order status to "cancelled" without deleting the entry.
 *     tags: [Order]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to cancel
 *     responses:
 *       200:
 *         description: Order successfully cancelled
 *       400:
 *         description: Order already cancelled or validation error
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
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
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({
        success: false,
        msg: `Order with ID ${orderId} does not exist!`,
      });
    }

    // Check if the order status is already cancelled
    if (order.status === "cancelled") {
      return res.status(400).json({
        success: false,
        msg: `Order with ID ${orderId} is already cancelled!`,
      });
    }

    // Cancel the order
    order.status = "cancelled";
    await order.save();

    // Find the associated PayCut entry
    const payCut = await PayCut.findOne({ orderId });
    if (payCut) {
      // Optionally, update the PayCut status or perform additional logic if needed
      payCut.status = "cancelled";
      await payCut.save();
    }

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Order with ID ${orderId} has been cancelled successfully.`,
      order, // Optionally return the updated order details
      // payCut, // Optionally return the updated PayCut details
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while canceling the order.",
    });
  }
};


//=========================== Seller Order List
/**
 * All order For the seller  
 */
/**
 * @swagger
 * /order/seller-order-list/{sellerId}:
 *   get:
 *     summary: Get all orders for a specific seller
 *     description: Fetches all orders placed with a particular seller.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller's ID
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Seller not found
 *       500:
 *         description: Server error
 */

// const sellerOrderList = async (req, res) => {
//   try {
//     // Validate the request
//     const valErrors = validationResult(req);
//     if (!valErrors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Validation errors",
//         errors: valErrors.array(),
//       });
//     }

//     const sellerId = req.params.sellerId;

//     // Check if the seller exists
//     const sellerExists = await Seller.findOne({ sellerId });
//     if (!sellerExists) {
//       return res.status(404).json({
//         success: false,
//         msg: "Seller not found.",
//       });
//     }

//     // Fetch orders, seller data, user data, and book info
//     const result = await Order.aggregate([
//       {
//         $match: { sellerId: sellerId }, // Match the specific sellerId
//       },
//       {
//         $lookup: {
//           from: "sellers", // Ensure this matches the actual collection name
//           localField: "sellerId", // Field in Order collection
//           foreignField: "sellerId", // Field in Seller collection
//           as: "orderData", // Alias for joined seller data
//         },
//       },
//       {
//         $unwind: "$orderData", // Flatten the orderData array
//       },
//       {
//         $lookup: {
//           from: "users", // Users collection
//           localField: "userId", // Field in Order collection
//           foreignField: "userId", // Field in User collection
//           as: "userData", // Alias for joined user data
//         },
//       },
//       {
//         $unwind: "$userData", // Flatten the userData array
//       },
//       {
//         $lookup: {
//           from: "books", // Books collection
//           localField: "isbn", // Field in Order collection
//           foreignField: "isbn", // Field in Book collection
//           as: "bookData", // Alias for joined book data
//         },
//       },
//       {
//         $unwind: {
//           path: "$bookData",
//           preserveNullAndEmptyArrays: true, // Keep order even if book not found
//         },
//       },
//       {
//         $group: {
//           _id: "$sellerId", // Group by sellerId
//           orders: {
//             $push: {
//               orderId: "$orderId",
//               isbn: "$isbn",
//               price: "$price",
//               quantity: "$quantity",
//               user: { // Include full user details
//                 userId: "$userData.userId",
//                 name: "$userData.name",
//                 email: "$userData.email",
//                 mobile: "$userData.mobile",
//                 address: "$userData.address",
//               },
//               bookInfo: { // Include book details
//                 data: "$bookData.data",
//                 genre: "$bookData.genre",
//                 spCluster: "$bookData.spCluster",
//               },
//               shippingAddress: "$shippingAddress",
//               status: "$status",
//               createdAt: "$createdAt",
//               updatedAt: "$updatedAt",
//             },
//           },
//           sellerInfo: {
//             $first: {
//               email: "$orderData.email",
//               name: "$orderData.name",
//               mobile: "$orderData.mobile",
//               storeName: "$orderData.storeName",
//               storeDescription: "$orderData.storeDescription",
//               image: "$orderData.image",
//               upiId: "$orderData.upiId",
//               address: "$orderData.address",
//               gstNumber: "$orderData.gstNumber",
//               socialMediaLinks: "$orderData.socialMediaLinks",
//               is_verified: "$orderData.is_verified",
//               role: "$orderData.role",
//               createdAt: "$orderData.createdAt",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Remove the _id field
//           sellerId: "$_id", // Rename _id to sellerId
//           orders: 1, // Include orders array
//           sellerInfo: 1, // Include seller info
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       msg: "Server error",
//     });
//   }
// };


const sellerOrderList = async (req, res) => {
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

    const sellerId = req.params.sellerId;

    // Check if the seller exists
    const sellerExists = await Seller.findOne({ sellerId });
    if (!sellerExists) {
      return res.status(404).json({
        success: false,
        msg: "Seller not found.",
      });
    }

    // Fetch orders, seller data, user data, and book info
    let result = await Order.aggregate([
      {
        $match: { sellerId: sellerId },
      },
      {
        $lookup: {
          from: "sellers",
          localField: "sellerId",
          foreignField: "sellerId",
          as: "orderData",
        },
      },
      { $unwind: "$orderData" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "userId",
          as: "userData",
        },
      },
      { $unwind: "$userData" },
      {
        $lookup: {
          from: "books",
          localField: "isbn",
          foreignField: "isbn",
          as: "bookData",
        },
      },
      {
        $unwind: {
          path: "$bookData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$sellerId",
          orders: {
            $push: {
              orderId: "$orderId",
              isbn: "$isbn",
              price: "$price",
              quantity: "$quantity",
              user: {
                userId: "$userData.userId",
                name: "$userData.name",
                email: "$userData.email",
                mobile: "$userData.mobile",
                address: "$userData.address",
              },
              bookInfo: {
                title: "$bookData.data",
                genre: "$bookData.genre",
                spCluster: "$bookData.spCluster",
              },
              shippingAddress: "$shippingAddress",
              status: "$status",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
          sellerInfo: {
            $first: {
              email: "$orderData.email",
              name: "$orderData.name",
              mobile: "$orderData.mobile",
              storeName: "$orderData.storeName",
              storeDescription: "$orderData.storeDescription",
              image: "$orderData.image",
              upiId: "$orderData.upiId",
              address: "$orderData.address",
              gstNumber: "$orderData.gstNumber",
              socialMediaLinks: "$orderData.socialMediaLinks",
              is_verified: "$orderData.is_verified",
              role: "$orderData.role",
              createdAt: "$orderData.createdAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          sellerId: "$_id",
          orders: 1,
          sellerInfo: 1,
        },
      },
    ]);

    // Process data to find the most sold book and total price correctly
    if (result.length > 0) {
      let allOrders = result[0].orders;
      let bookSales = {};

      allOrders.forEach(order => {
        const { isbn, quantity, price, bookInfo } = order;
        if (!isbn || !bookInfo || quantity === 0) return;

        // Correct price per book calculation
        const pricePerBook = price / quantity;

        if (!bookSales[isbn]) {
          bookSales[isbn] = {
            totalSold: 0,
            totalPrice: 0,
            details: bookInfo,
          };
        }

        bookSales[isbn].totalSold += quantity;
        bookSales[isbn].totalPrice += pricePerBook * quantity; // Corrected price calculation
      });

      // Find the highest sold book
      let hotSellingBook = Object.entries(bookSales)
        .sort((a, b) => b[1].totalSold - a[1].totalSold)
        .map(([isbn, data]) => ({
          isbn,
          totalCopiesSold: data.totalSold,
          totalPriceEarned: data.totalPrice.toFixed(2), // Format to 2 decimal places
          details: data.details,
        }))[0];

      if (hotSellingBook) {
        result[0].hotSellingBook = hotSellingBook;
      }
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

//========================== User Order List

/**
 * @swagger
 * /order/user-order-list/{userId}:
 *   get:
 *     summary: Get all orders placed by a specific user
 *     description: Fetches all orders that a user has placed with different sellers.
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       400:
 *         description: Validation errors
 *       404:
 *         description: User not found or no orders available
 *       500:
 *         description: Server error
 */
const userOrderList = async (req, res) => {
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

    const userId = req.params.userId;

    // Check if the user exists
    const userExists = await User.findOne({ userId });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        msg: "User not found.",
      });
    }

    // Fetch orders, user data, and seller data
    const result = await Order.aggregate([
      {
        $match: { userId: userId }, // Match the specific userId
      },
      {
        $lookup: {
          from: "users", // Ensure this matches the actual collection name
          localField: "userId", // Field in Order collection
          foreignField: "userId", // Field in User collection
          as: "userData", // Alias for joined user data
        },
      },
      {
        $unwind: "$userData", // Flatten the userData array
      },
      {
        $lookup: {
          from: "sellers", // Ensure this matches the actual collection name
          let: { sellerId: "$sellerId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$sellerId", "$$sellerId"] } } },
            {
              $project: {
                sellerId: 1,
                name: 1,
                email: 1,
                mobile: 1,
                storeName: 1,
                storeDescription: 1,
                image: 1,
                address: 1,
                gstNumber: 1,
                socialMediaLinks: 1,
                is_verified: 1,
              },
            },
          ],
          as: "sellerData", // Alias for joined seller data
        },
      },
      {
        $unwind: {
          path: "$sellerData",
          preserveNullAndEmptyArrays: true, // Keep the order even if no seller is found
        },
      },
      {
        $lookup: {
          from: "books", // Ensure this matches the actual collection name
          localField: "isbn", // Field in Order collection
          foreignField: "isbn", // Field in Book collection
          as: "bookInfo",
        },
      },
      {
        $unwind: {
          path: "$bookInfo",
          preserveNullAndEmptyArrays: true, // Keep the order even if no book is found
        },
      },
      {
        $group: {
          _id: "$userId", // Group by userId
          orders: {
            $push: {
              orderId: "$orderId",
              isbn: "$isbn",
              price: "$price",
              quantity: "$quantity",
              bookInfo: {
                $cond: {
                  if: { $not: ["$bookInfo"] }, // Check if bookInfo is null or empty
                  then: {
                    message: "Book details not found",
                  },
                  else: {
                    data: "$bookInfo.data",
                    genre: "$bookInfo.genre",
                    isbn: "$bookInfo.isbn",
                  },
                },
              },
              seller: {
                $cond: {
                  if: { $not: ["$sellerData"] }, // Check if sellerData is null or empty
                  then: {
                    message: "Seller is no longer on the Booklio platform",
                  },
                  else: {
                    sellerId: "$sellerData.sellerId",
                    name: "$sellerData.name",
                    email: "$sellerData.email",
                    mobile: "$sellerData.mobile",
                    storeName: "$sellerData.storeName",
                    storeDescription: "$sellerData.storeDescription",
                    image: "$sellerData.image",
                    address: "$sellerData.address",
                    gstNumber: "$sellerData.gstNumber",
                    socialMediaLinks: "$sellerData.socialMediaLinks",
                    is_verified: "$sellerData.is_verified",
                  },
                },
              },
              shippingAddress: "$shippingAddress",
              status: "$status",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
          userInfo: {
            $first: {
              userId: "$userData.userId",
              name: "$userData.name",
              email: "$userData.email",
              mobile: "$userData.mobile",
              createdAt: "$userData.createdAt",
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove the _id field
          userId: "$_id", // Rename _id to userId
          orders: 1, // Include orders array
          userInfo: 1, // Include user info
        },
      },
    ]);

    // If no orders found for the user
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No orders found for this user.",
      });
    }

    // Return success response with order data
    return res.status(200).json({
      success: true,
      msg: `Order list for the user.`,
      orderData: result,
    });
  } catch (error) {
    console.error("Error in userOrderList: ", error.message);
    return res.status(500).json({
      success: false,
      msg: error.message || "An error occurred while fetching the user's order list.",
    });
  }
};


// const userOrderList = async (req, res) => {
//   try {
//     // Validate the request
//     const valErrors = validationResult(req);
//     if (!valErrors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         msg: "Validation errors",
//         errors: valErrors.array(),
//       });
//     }

//     const userId = req.params.userId;



//     // Check if the user exists
//     const userExists = await User.findOne({ userId });
//     if (!userExists) {
//       return res.status(404).json({
//         success: false,
//         msg: "User not found.",
//       });
//     }

//     // Fetch orders, user data, and seller data
//     const result = await Order.aggregate([
//       {
//         $match: { userId: userId }, // Match the specific userId
//       },
//       {
//         $lookup: {
//           from: "users", // Ensure this matches the actual collection name
//           localField: "userId", // Field in Order collection
//           foreignField: "userId", // Field in User collection
//           as: "userData", // Alias for joined user data
//         },
//       },
//       {
//         $unwind: "$userData", // Flatten the userData array
//       },
//       {
//         $lookup: {
//           from: "sellers", // Ensure this matches the actual collection name
//           let: { sellerId: "$sellerId" },
//           pipeline: [
//             { $match: { $expr: { $eq: ["$sellerId", "$$sellerId"] } } },
//             {
//               $project: {
//                 sellerId: 1,
//                 name: 1,
//                 email: 1,
//                 mobile: 1,
//                 storeName: 1,
//                 storeDescription: 1,
//                 image: 1,
//                 address: 1,
//                 gstNumber: 1,
//                 socialMediaLinks: 1,
//                 is_verified: 1,
//               },
//             },
//           ],
//           as: "sellerData", // Alias for joined seller data
//         },
//       },
//       {
//         $unwind: {
//           path: "$sellerData",
//           preserveNullAndEmptyArrays: true, // Keep the order even if no seller is found
//         },
//       },
//       {
//         $group: {
//           _id: "$userId", // Group by userId
//           orders: {
//             $push: {
//               orderId: "$orderId",
//               isbn: "$isbn",
//               price: "$price",
//               quantity: "$quantity",
//               seller: {
//                 $cond: {
//                   if: { $not: ["$sellerData"] }, // Check if sellerData is null or empty
//                   then: {
//                     message: "Seller is no longer on the Booklio platform",
//                   },
//                   else: {
//                     sellerId: "$sellerData.sellerId",
//                     name: "$sellerData.name",
//                     email: "$sellerData.email",
//                     mobile: "$sellerData.mobile",
//                     storeName: "$sellerData.storeName",
//                     storeDescription: "$sellerData.storeDescription",
//                     image: "$sellerData.image",
//                     address: "$sellerData.address",
//                     gstNumber: "$sellerData.gstNumber",
//                     socialMediaLinks: "$sellerData.socialMediaLinks",
//                     is_verified: "$sellerData.is_verified",
//                   },
//                 },
//               },
//               shippingAddress: "$shippingAddress",
//               status: "$status",
//               createdAt: "$createdAt",
//               updatedAt: "$updatedAt",
//             },
//           },
//           userInfo: {
//             $first: {
//               userId: "$userData.userId",
//               name: "$userData.name",
//               email: "$userData.email",
//               mobile: "$userData.mobile",
//               createdAt: "$userData.createdAt",
//             },
//           },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Remove the _id field
//           userId: "$_id", // Rename _id to userId
//           orders: 1, // Include orders array
//           userInfo: 1, // Include user info
//         },
//       },
//     ]);

//     // If no orders found for the user
//     if (!result || result.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: "No orders found for this user.",
//       });
//     }

//     // Return success response with order data
//     return res.status(200).json({
//       success: true,
//       msg: `Order list for the user.`,
//       orderData: result,
//     });
//   } catch (error) {
//     console.error("Error in userOrderList: ", error.message);
//     return res.status(500).json({
//       success: false,
//       msg: error.message || "An error occurred while fetching the user's order list.",
//     });
//   }
// };





module.exports = { placeOrder, cancelOrder, sellerOrderList, userOrderList };
