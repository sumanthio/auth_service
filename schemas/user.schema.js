const Mongoose = require("mongoose");

const User = new Mongoose.Schema({
  name: String,
  email: String,
  password: String
});

module.exports = User;
