import { Request, Response } from "express";
import Category from "../models/category.model";

export const titleNotEmpty = (req: Request, res: Response, next: Function) => {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }
  next();
};
export const tittleNotMoreThan30Chars = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (req.body.title && req.body.title.length > 30) {
    return res
      .status(400)
      .json({ message: "Title must not exceed 30 characters" });
  }
  next();
};
export const categotyExistCheck = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const categoryId = req.body.categoryId;
  if (!categoryId) {
    return res.status(400).json({ message: "Category ID is required" });
  }
  const category = await Category.findById(categoryId);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  next();
};
