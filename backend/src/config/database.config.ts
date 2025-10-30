import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connect = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connect DB successfully");
  } catch (err) {
    console.log("Connect DB fail:", err);
  }
};
