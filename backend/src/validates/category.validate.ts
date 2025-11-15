import { Request, Response } from "express";

export const validateEmail = (req: Request, res: Response, next: Function) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //
  if (req.body.email && !emailRegex.test(req.body.email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  next();
};
export const validatePassword = (
  req: Request,
  res: Response,
  next: Function
) => {
  const password = req.body.password;
  if (password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }
  }
  next();
};
