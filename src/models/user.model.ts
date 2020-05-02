import * as mongoose from "mongoose";

const Schema = mongoose.Schema;
interface UserModel extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  token_version: number;
  created_at: Date;
  modified_at: Date;
}

let UserSchema = new Schema({
  first_name: { type: String, required: true, min: 6, max: 50 },
  last_name: { type: String, required: true, min: 3, max: 50 },
  email: { type: String, required: true, min: 6 },
  password: { type: String, required: true, min: 6 },
  token_version: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  modified_at: { type: Date, default: Date.now },
}).pre<UserModel>("save", function (next: mongoose.HookNextFunction) {
  let now = new Date();
  if (this.isNew) this.created_at = now;
  this.modified_at = now;
  next();
});
const Users = mongoose.model<UserModel>("users", UserSchema, "users", true);

export default Users;
