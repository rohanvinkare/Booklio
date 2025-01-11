const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid"); // Importing the uuid function

const payCutSchema = new mongoose.Schema(
    {
        payCutId: {
            type: String,
            default: uuidv4, // Generate a new UUID by default
            unique: true, // Ensure the payCutId is unique
        },
        orderId: {
            type: String,
            required: true,
        },
        payCut: {
            type: Number, // Assuming `payCut` is a monetary value
            required: true,
        },
        // Order status (e.g., pending, shipped, delivered, canceled)
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "canceled","completed"],
            default: "pending",
        },
    },
    {
        timestamps: true, // Automatically add `createdAt` and `updatedAt`
    }
);

module.exports = mongoose.model("PayCut", payCutSchema);
