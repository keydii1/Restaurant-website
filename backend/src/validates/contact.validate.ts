import { Request, Response } from "express";

export const nameRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({ message: "Name is required" });
  }
  next();
};

export const nameLength = (req: Request, res: Response, next: Function) => {
  if (req.body.name && req.body.name.length > 100) {
    return res
      .status(400)
      .json({ message: "Name must not exceed 100 characters" });
  }
  next();
};

export const messageRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.message || req.body.message.trim() === "") {
    return res.status(400).json({ message: "Message is required" });
  }
  next();
};

export const messageLength = (req: Request, res: Response, next: Function) => {
  if (req.body.message && req.body.message.length < 10) {
    return res
      .status(400)
      .json({ message: "Message must be at least 10 characters long" });
  }
  if (req.body.message && req.body.message.length > 1000) {
    return res
      .status(400)
      .json({ message: "Message must not exceed 1000 characters" });
  }
  next();
};

export const statusValid = (req: Request, res: Response, next: Function) => {
  const validStatuses = ["Pending", "Reviewed", "Resolved"];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({
      message: "Status must be either Pending, Reviewed, or Resolved",
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
        "Invalid email format, please enter a email that have to match the format:  example@example.com",
    });
  }
  next();
};
