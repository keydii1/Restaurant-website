import { Request, Response } from "express";

export const amountRequired = (req: Request, res: Response, next: Function) => {
  if (!req.body.amount && req.body.amount !== 0) {
    return res.status(400).json({ message: "Amount is required" });
  }
  next();
};

export const amountValid = (req: Request, res: Response, next: Function) => {
  const amount = req.body.amount;
  if (amount !== undefined && (isNaN(amount) || amount < 0)) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }
  next();
};

export const orderIdRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.orderId || req.body.orderId.trim() === "") {
    return res.status(400).json({ message: "Order ID is required" });
  }
  next();
};
