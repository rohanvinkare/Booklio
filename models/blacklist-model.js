const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      requierd: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blacklist", blacklistSchema);
