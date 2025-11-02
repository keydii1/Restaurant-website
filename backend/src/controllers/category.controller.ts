import { Request, Response } from "express";
import Category from "../models/category.model";
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json({
      code: 200,
      message: "Success",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Internal server error",
      error: error,
    });
  }
};
