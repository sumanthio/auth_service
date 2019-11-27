const Mongoose = require("mongoose");

const User = new Mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String
});

module.exports = User;
