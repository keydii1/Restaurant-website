import { Request, Response } from "express";

export const titleRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }
  next();
};

export const titleLength = (req: Request, res: Response, next: Function) => {
  if (req.body.title && req.body.title.length > 100) {
    return res
      .status(400)
      .json({ message: "Title must not exceed 100 characters" });
  }
  next();
};

export const contentRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.content || req.body.content.trim() === "") {
    return res.status(400).json({ message: "Content is required" });
  }
  next();
};

export const contentLength = (req: Request, res: Response, next: Function) => {
  if (req.body.content && req.body.content.length < 10) {
    return res
      .status(400)
      .json({ message: "Content must be at least 10 characters long" });
  }
  next();
};
