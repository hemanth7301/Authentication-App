const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: [true, "Please provide a unique UserName"],
  },
  password: {
    unique: false,
    type: String,
    required: [true, "Please provide a password"],
  },
  email: {
    type: String,
    required: [true, "Please provide a Email"],
    unique: true,
  },
  firstName: { type: String },
  LastName: { type: String },
  address: { type: String },
  mobile: { type: String },
  profile: { type: String },
});

module.exports = mongoose.model.Users || mongoose.model("User", userSchema);
