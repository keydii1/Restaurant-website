import { Request, Response } from "express";
import User from "../models/user.model";

export const usernameNotEmpty = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.username || req.body.username.trim() === "") {
    return res.status(400).json({ message: "Username is required" });
  }
  next();
};

export const emailValid = (req: Request, res: Response, next: Function) => {
  const email = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      message:
        "Invalid email format, please enter a email that have to match the format: user@example.com",
    });
  }
  next();
};
export const emailExistCheck = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const email = req.body.email;
  if (email) {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already in use, please enter new email" });
    }
  }
  next();
};
export const usernameExistCheck = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const username = req.body.username;
  if (username) {
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already in use, please enter new username",
      });
    }
  }
  next();
};
export const phoneExistCheck = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const phone = req.body.phone;
  if (phone) {
    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res.status(400).json({
        message: "Phone number already in use, please enter new phone number",
      });
    }
  }
  next();
};
export const passwordRequirements = (
  req: Request,
  res: Response,
  next: Function
) => {
  const password = req.body.password;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  // Kiểm tra độ dài tối thiểu 8 ký tự
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }
  // Kiểm tra có ít nhất 1 chữ thường
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      message: "Password must include at least one lowercase letter",
    });
  }
  // Kiểm tra có ít nhất 1 chữ hoa
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      message: "Password must include at least one uppercase letter",
    });
  }
  // Kiểm tra có ít nhất 1 số
  if (!/\d/.test(password)) {
    return res.status(400).json({
      message: "Password must include at least one number",
    });
  }
  // Kiểm tra có ít nhất 1 ký tự đặc biệt
  if (!/[@$!%*?&#^()_+\-=\[\]{}|;:'",.<>\/\\]/.test(password)) {
    return res.status(400).json({
      message: "Password must include at least one special character",
    });
  }
  next();
};
