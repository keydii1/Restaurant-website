import { Request, Response } from "express";
import Discount from "../models/discount.model";

export const codeRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.code || req.body.code.trim() === "") {
    return res.status(400).json({ message: "Discount code is required" });
  }
  next();
};

export const codeLength = (req: Request, res: Response, next: Function) => {
  if (req.body.code && req.body.code.length > 50) {
    return res
      .status(400)
      .json({ message: "Discount code must not exceed 50 characters" });
  }
  next();
};

export const codeUnique = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const code = req.body.code;
  if (code) {
    const existingDiscount = await Discount.findOne({ code: code });
    if (existingDiscount && existingDiscount._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Discount code already exists" });
    }
  }
  next();
};

export const percentageRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.body.percentage === undefined || req.body.percentage === null) {
    return res.status(400).json({ message: "Percentage is required" });
  }
  next();
};

export const percentageValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const percentage = req.body.percentage;
  if (
    percentage !== undefined &&
    (isNaN(percentage) || percentage < 0 || percentage > 100)
  ) {
    return res
      .status(400)
      .json({ message: "Percentage must be between 0 and 100" });
  }
  next();
};

export const dateRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.validFrom) {
    return res.status(400).json({ message: "Valid from date is required" });
  }
  if (!req.body.validTo) {
    return res.status(400).json({ message: "Valid to date is required" });
  }
  next();
};

export const dateValid = (req: Request, res: Response, next: Function) => {
  const validFrom = new Date(req.body.validFrom);
  const validTo = new Date(req.body.validTo);

  if (isNaN(validFrom.getTime())) {
    return res.status(400).json({ message: "Invalid validFrom date format" });
  }
  if (isNaN(validTo.getTime())) {
    return res.status(400).json({ message: "Invalid validTo date format" });
  }
  if (validFrom >= validTo) {
    return res
      .status(400)
      .json({ message: "Valid from date must be before valid to date" });
  }
  next();
};
