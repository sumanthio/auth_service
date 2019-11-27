const mongoose = require("mongoose");
const userSchema = require("../schemas/user.schema.js");

const Users = mongoose.model("users", userSchema);

export default Users;
