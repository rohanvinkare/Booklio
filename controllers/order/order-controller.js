const Book = require("../../models/books/books-model");
const Seller = require("../../models/seller/seller-model");
const User = require("../../models/user/user-model");
const Order = require("../../models/orders/orders-model");
const { validationResult } = require("express-validator");
const PayCut = require("../../models/paycut/paycut-model")
const { find } = require("../../models/blacklist-model");
require("dotenv").config();

//----------------------------------- To Place The Order
/**
 * To place the order
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

    // Extracting sellerId, isbn, and shippingAddress from request body
    const { sellerId, isbn, shippingAddress } = req.body;

    // Find the book by ISBN
    const book = await Book.findOne({ isbn });
    if (!book) {
      return res.status(404).json({
        success: false,
        msg: "Book not found",
      });
    }

    // Find the book price for the given seller
    const bookPrice = book.spCluster.find((element) => element.sellerId === sellerId);
    if (!bookPrice) {
      return res.status(404).json({
        success: false,
        msg: "Price not found for the given seller",
      });
    }

    // Create a new order
    const newOrder = new Order({
      isbn: book.isbn,
      price: bookPrice.price,
      userId: userId,
      sellerId: sellerId,
      shippingAddress: shippingAddress,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Calculate the 5% payCut from the order price
    const payCutAmount = (bookPrice.price * process.env.PAY_CUT_PERCENTAGE) / 100;

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
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
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
    const order = await Order.findOne({ orderId });
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

    // Find the associated PayCut entry
    const payCut = await PayCut.findOne({ orderId });
    if (payCut) {
      // Optionally, update the PayCut status or perform additional logic if needed
      payCut.status = "canceled";
      await payCut.save();
    }

    // Return success response
    return res.status(200).json({
      success: true,
      msg: `Order with ID ${orderId} has been canceled successfully.`,
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
    const userExists = await Seller.findOne({ sellerId });
    if (!userExists) {
      return res.status(404).json({
        success: false,
        msg: "Seller not found.",
      });
    }

    // Fetch orders, seller data, and user data
    const result = await Order.aggregate([
      {
        $match: { sellerId: sellerId }, // Match the specific sellerId
      },
      {
        $lookup: {
          from: "sellers", // Ensure this matches the actual collection name
          localField: "sellerId", // Field in Order collection
          foreignField: "sellerId", // Field in Seller collection
          as: "orderData", // Alias for joined seller data
        },
      },
      {
        $unwind: "$orderData", // Flatten the orderData array
      },
      {
        $lookup: {
          from: "users", // Users collection
          localField: "userId", // Field in Order collection
          foreignField: "userId", // Field in User collection
          as: "userData", // Alias for joined user data
        },
      },
      {
        $unwind: "$userData", // Flatten the userData array
      },
      {
        $group: {
          _id: "$sellerId", // Group by sellerId
          orders: {
            $push: {
              orderId: "$orderId",
              isbn: "$isbn",
              price: "$price",
              user: { // Include full user details instead of userId
                userId: "$userData.userId",
                name: "$userData.name",
                email: "$userData.email",
                mobile: "$userData.mobile",
                address: "$userData.address",
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
          _id: 0, // Remove the _id field
          sellerId: "$_id", // Rename _id to sellerId
          orders: 1, // Include orders array
          sellerInfo: 1, // Include seller info
        },
      },
    ]);

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



//=========================== User Order List
/**
 * All order For the User
 */

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

//     console.log(userId)

//     // Check if the user exists
//     const userExists = await User.findOne({ userId });
//     if (!userExists) {
//       return res.status(404).json({
//         success: false,
//         msg: "User not found.",
//       });
//     }



//     // Fetch orders and user data
//     const result = await Order.aggregate([
//       {
//         $match: { userId: userId }  // Match the specific userId
//       },
//       {
//         $lookup: {
//           from: "users",               // Ensure this matches the actual collection name
//           localField: "userId",        // Field in Order collection
//           foreignField: "userId",      // Field in users collection
//           as: "orderData"                // Alias for joined seller data
//         }
//       },
//       {
//         $unwind: "$orderData"           // Flatten the orderData array (since $lookup creates an array)
//       },
//       {
//         $group: {
//           _id: "$userId",              // Group by userId
//           orders: {
//             $push: {             // Push all order data into an array
//               orderId: "$orderId",
//               isbn: "$isbn",
//               price: "$price",
//               sellerId: "$sellerId",
//               shippingAddress: "$shippingAddress",
//               status: "$status",
//               createdAt: "$createdAt",
//               updatedAt: "$updatedAt"
//             }
//           },
//           userInfo: {
//             $first: { // Get the first matching seller's info
//               userId: "$orderData.userId",
//               name: "$orderData.name",
//               email: "$orderData.email",
//               mobile: "$orderData.mobile",
//               createdAt: "$orderData.createdAt"
//             }
//           },
//         }
//       },
//       {
//         $project: {                     // Customize the final output format
//           _id: 0,                        // Remove the _id field
//           userId: "$_id",              // Rename _id to sellerId
//           orders: 1,                     // Include orders array
//           userInfo: 1                  // Include seller info
//         }
//       }
//     ]);


//     // If no orders found for the seller
//     if (!result || result.length === 0) {
//       return res.status(404).json({
//         success: false,
//         msg: "No orders found for this User.",
//       });
//     }

//     // Return success response with order data
//     return res.status(200).json({
//       success: true,
//       msg: `Order list for the user.`,
//       orderData: result
//     });

//   } catch (error) {
//     console.error("Error in userOrderList: ", error.message);
//     return res.status(500).json({
//       success: false,
//       msg: error.message || "An error occurred while fetching the user's order list.",
//     });
//   }



// }

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
        $group: {
          _id: "$userId", // Group by userId
          orders: {
            $push: {
              orderId: "$orderId",
              isbn: "$isbn",
              price: "$price",
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

module.exports = { placeOrder, cancelOrder, sellerOrderList, userOrderList };
