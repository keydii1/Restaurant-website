import { Request, Response } from "express";
export const titleNotEmpty = (req: Request, res: Response, next: Function) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }
  next();
};

export const statusValid = (req: Request, res: Response, next: Function) => {
  const validStatuses = ["active", "inactive"];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res
      .status(400)
      .json({ message: "Status must be either active or inactive" });
  }
  next();
};
export const test = (req: Request, res: Response, next: Function) => {
  console.log("Test middleware executed");
  next();
};
