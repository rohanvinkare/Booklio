const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Number,
    default: 0, // 1--> verified
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
