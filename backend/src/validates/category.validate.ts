import { Request, Response } from "express";

export const nameRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({ message: "Category name is required" });
  }
  next();
};

export const nameLength = (req: Request, res: Response, next: Function) => {
  if (req.body.name && req.body.name.length > 100) {
    return res
      .status(400)
      .json({ message: "Category name must not exceed 100 characters" });
  }
  next();
};

export const descriptionLength = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.body.description && req.body.description.length > 500) {
    return res
      .status(400)
      .json({ message: "Description must not exceed 500 characters" });
  }
  next();
};

export const statusValid = (req: Request, res: Response, next: Function) => {
  const validStatuses = ["active", "inactive"];
  const status = req.params.status;
  if (status && !validStatuses.includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be either active or inactive" });
  }
  next();
};
