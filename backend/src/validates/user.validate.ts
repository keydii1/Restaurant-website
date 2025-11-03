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
export const passwordRequirements = (
  req: Request,
  res: Response,
  next: Function
) => {
  const password = req.body.password;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number
  if (password && !passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one letter and one number",
    });
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
export const roleValid = (req: Request, res: Response, next: Function) => {
  const validRoles = ["admin", "user", "manager"];
  if (req.body.role && !validRoles.includes(req.body.role)) {
    return res
      .status(400)
      .json({ message: "Role must be either admin, user, or manager" });
  }
  next();
};
