const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const managementSchema = new mongoose.Schema({
  memberId: {
    type: String,
    default: uuidv4, // Automatically generate a unique ID
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "member",
  },
  image: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

// Pre-save hook to set the memberId
managementSchema.pre("save", function (next) {
  if (!this.memberId) {
    this.memberId = uuidv4(); // Generate a new UUID if not already set
  }
  next();
});

module.exports = mongoose.model("Management", managementSchema);
