import { Document, Schema, model } from "mongoose";
interface Iuser extends Document {
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  address?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  isAdmin?: boolean;
  loginMethod?: "manual" | "google";
  googleId?: string;
  refreshToken?: string;
}
const userSchema: Schema = new Schema(
  {
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    loginMethod: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
    googleId: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
const User = model<Iuser>("User", userSchema);
export default User;
