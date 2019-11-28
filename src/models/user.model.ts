import mongoose from "mongoose";
import UserSchema from "../schemas/user.schema";

const Users = mongoose.model("users", UserSchema);

export default Users;
