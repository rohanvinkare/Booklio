const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the current date
      expires: 86400, // The document will be removed 86400 seconds (1 day) after creation
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

// Create the TTL index on the 'createdAt' field
blacklistSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("Blacklist", blacklistSchema);
