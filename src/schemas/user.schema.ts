const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  first_name: { type: String, required: true, min: 6, max: 50 },
  last_name: { type: String, required: true, min: 3, max: 50 },
  email: { type: String, required: true, min: 6 },
  password: { type: String, required: true, min: 6 },
  date: { type: Date, default: Date.now }
});

export default UserSchema;
