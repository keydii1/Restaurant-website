import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";

// Validate dish name (thay vì title)
export const nameNotEmpty = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.name || req.body.name.trim() === "") {
    return res.status(400).json({ message: "Name is required" });
  }
  next();
};

export const nameNotMoreThan100Chars = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.name && req.body.name.length > 100) {
    return res
      .status(400)
      .json({ message: "Name must not exceed 100 characters" });
  }
  next();
};

// Validate price
export const priceValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const price = parseFloat(req.body.price);
  if (req.body.price !== undefined && (isNaN(price) || price < 0)) {
    return res
      .status(400)
      .json({ message: "Price must be a valid positive number" });
  }
  next();
};

// Validate discount
export const discountValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const discount = parseFloat(req.body.discount);
  if (
    req.body.discount !== undefined &&
    (isNaN(discount) || discount < 0 || discount > 100)
  ) {
    return res
      .status(400)
      .json({ message: "Discount must be between 0 and 100" });
  }
  next();
};

// Validate rating
export const ratingValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rating = parseFloat(req.body.rating);
  if (
    req.body.rating !== undefined &&
    (isNaN(rating) || rating < 0 || rating > 5)
  ) {
    return res.status(400).json({ message: "Rating must be between 0 and 5" });
  }
  next();
};

// Validate prepareTime
export const prepareTimeValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prepareTime = parseInt(req.body.prepareTime);
  if (
    req.body.prepareTime !== undefined &&
    (isNaN(prepareTime) || prepareTime < 0)
  ) {
    return res
      .status(400)
      .json({ message: "Prepare time must be a valid positive number" });
  }
  next();
};

// Validate category exists
export const categoryExistCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const categoryId = req.body.categoryId;
  if (!categoryId) {
    return res.status(400).json({ message: "Category ID is required" });
  }
  
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid category ID format" });
  }
};

// Validate description length
export const descriptionValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.body.description && req.body.description.length > 1000) {
    return res
      .status(400)
      .json({ message: "Description must not exceed 1000 characters" });
  }
  next();
};

// Legacy exports for backward compatibility
export const titleNotEmpty = nameNotEmpty;
export const tittleNotMoreThan30Chars = nameNotMoreThan100Chars;
export const categotyExistCheck = categoryExistCheck;
