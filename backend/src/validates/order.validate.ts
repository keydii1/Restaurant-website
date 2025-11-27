import { Request, Response } from "express";

export const statusValid = (req: Request, res: Response, next: Function) => {
  const validStatuses = [
    "pending",
    "confirmed",
    "preparing",
    "completed",
    "cancelled",
  ];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({
      message:
        "Status must be one of: pending, confirmed, preparing, completed, cancelled",
    });
  }
  next();
};

export const totalPriceValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const totalPrice = req.body.totalPrice;
  if (totalPrice !== undefined && (isNaN(totalPrice) || totalPrice < 0)) {
    return res
      .status(400)
      .json({ message: "Total price must be a positive number" });
  }
  next();
};

export const typeOfPaymentValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const validTypes = ["cash", "card", "online", "momo", "zalopay"];
  if (req.body.typeOfPayment && !validTypes.includes(req.body.typeOfPayment)) {
    return res.status(400).json({
      message:
        "Type of payment must be one of: cash, card, online, momo, zalopay",
    });
  }
  next();
};
