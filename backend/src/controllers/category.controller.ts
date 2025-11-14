import { Request, Response } from "express";
import Category from "../models/category.model";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    return new OK({
      message: "Categories fetched successfully",
      metadata: categories,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    return new OK({
      message: "Category created successfully",
      metadata: newCategory,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Category.updateOne({ _id: id }, req.body);
    return new OK({
      message: "Category updated successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const Delete = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Category.deleteOne({ _id: id }, { deleted: true });
    return new OK({
      message: "Category deleted successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const changeMulti = async (req: Request, res: Response) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch (type) {
      case "delete":
        await Category.updateMany({ _id: { $in: ids } }, { deleted: true });
        res.json({ message: "Categories deleted successfully" });
        break;
      case "active":
        await Category.updateMany({ _id: { $in: ids } }, { status: "active" });
        return new OK({
          message: "Categories activated successfully",
        }).send(res);
        break;
      case "inactive":
        await Category.updateMany(
          { _id: { $in: ids } },
          { status: "inactive" }
        );
        return new OK({
          message: "Categories deactivated successfully",
        }).send(res);
        break;
      default:
        return res.status(400).json({ message: "Invalid type parameter" });
    }
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const status = req.params.status;
    await Category.updateOne({ _id: categoryId }, { status: status });
    return new OK({
      message: "Category status updated successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
