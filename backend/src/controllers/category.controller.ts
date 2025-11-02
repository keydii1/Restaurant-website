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
export const create = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Category.updateOne({ _id: id }, req.body);
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const Delete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Category.deleteOne({ _id: id }, { deleted: true });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
