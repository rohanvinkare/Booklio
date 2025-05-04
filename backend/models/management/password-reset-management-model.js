const mongoose = require("mongoose");

const memberPasswordResetSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    ref: "Management",
  },
  token: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model(
  "MemberPasswordReset",
  memberPasswordResetSchema
);
