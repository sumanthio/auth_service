import * as mongoose from "mongoose";
import { ObjectType, Field } from "type-graphql";

const Schema = mongoose.Schema;
interface UserModel extends mongoose.Document {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  createdAt: Date;
  modifiedAt: Date;
}

let UserSchema = new Schema({
  first_name: { type: String, required: true, min: 6, max: 50 },
  last_name: { type: String, required: true, min: 3, max: 50 },
  email: { type: String, required: true, min: 6 },
  password: { type: String, required: true, min: 6 },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
}).pre<UserModel>("save", function(next: mongoose.HookNextFunction) {
  let now = new Date();
  if (this.isNew) this.createdAt = now;
  this.modifiedAt = now;
  next();
});
const Users = mongoose.model<UserModel>("users", UserSchema, "users", true);

export default Users;
