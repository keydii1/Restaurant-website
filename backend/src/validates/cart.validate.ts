import { Request, Response } from "express";
import Dish from "../models/dish.model";

export const dishIdRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.dishId) {
    return res.status(400).json({ message: "Dish ID is required" });
  }
  next();
};

export const dishExists = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const dishId = req.body.dishId;
  if (dishId) {
    try {
      const dish = await Dish.findById(dishId);
      if (!dish) {
        return res.status(404).json({ message: "Dish not found" });
      }
    } catch (error) {
      return res.status(400).json({ message: "Invalid dish ID format" });
    }
  }
  next();
};

export const quantityRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.quantity) {
    return res.status(400).json({ message: "Quantity is required" });
  }
  next();
};

export const quantityValid = (req: Request, res: Response, next: Function) => {
  const quantity = req.body.quantity;
  if (quantity && (isNaN(quantity) || quantity < 1)) {
    return res
      .status(400)
      .json({ message: "Quantity must be a positive number" });
  }
  next();
};
