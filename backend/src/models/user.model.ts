import { Document, Schema, model } from "mongoose";
interface Iuser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  address?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  isAdmin?: boolean;
}
const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
const User = model<Iuser>("User", userSchema);
export default User;
