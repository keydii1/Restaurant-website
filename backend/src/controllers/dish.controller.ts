import express, { Express, Request, Response } from "express";
import Dish from "../models/dish.model";
import dotenv from "dotenv";
import paginationHelper from "../helpers/pagination.helper";
dotenv.config();

export const getDishes = async (req: Request, res: Response) => {
  try {
    // define filter conditions
    interface DishCondition {
      deleted?: boolean;
      status?: string;
      name?: RegExp;
    }
    const findCondition: DishCondition = {
      deleted: false,
    };
    const filterStatus = req.query.status as string;
    const filterKeyword = req.query.keyword as string;
    const sortKey = req.query.sortKey as string;
    const sortValue = req.query.sortValue as string;
    //  start status
    if (filterStatus) {
      findCondition.status = filterStatus as string;
    }
    // end status
    // start keyword
    if (filterKeyword) {
      const keywordRegex = new RegExp(filterKeyword, "i"); // Case-insensitive regex
      findCondition.name = keywordRegex;
    }
    // end keyword
    // sort

    let sortCondition: any = {};
    if (sortKey && sortValue) {
      sortCondition[sortKey] = sortValue;
    }
    // end sort
    // start pagination
    const countDishes = await Dish.countDocuments(findCondition);
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limit: 10,
      },
      req,
      countDishes
    );
    // end pagination
    const dishes = await Dish.find(findCondition)
      .sort(sortCondition)
      .skip(objectPagination.skip)
      .limit(objectPagination.limit)
      .populate("categoryId", "name");
    res.json({
      message: "Dishes fetched successfully",
      data: {
        dishes: dishes,
        totalPages: objectPagination.totalPages,
        currentPage: objectPagination.currentPage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const changeStatus = async (req: Request, res: Response) => {
  try {
    const dishId = req.params.id;
    const status = req.params.status;
    await Dish.updateOne({ _id: dishId }, { status: status });
    res.json({
      message: "Dish status updated successfully",
      data: await Dish.findById(dishId).populate("categoryId", "name"),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const changeMulti = async (req: Request, res: Response) => {
  try {
    const type = req.body.type;
    const ids = req.body.ids.split(",");
    switch (type) {
      case "delete":
        await Dish.updateMany({ _id: { $in: ids } }, { deleted: true });
        res.json({
          message: "Dishes deleted successfully",
          data: await Dish.find({ _id: { $in: ids } }).populate(
            "categoryId",
            "name"
          ),
        });
        break;
      case "active":
        await Dish.updateMany({ _id: { $in: ids } }, { status: "active" });
        res.json({
          message: "Dishes activated successfully",
          data: await Dish.find({ _id: { $in: ids } }).populate(
            "categoryId",
            "name"
          ),
        });
        break;
      case "inactive":
        await Dish.updateMany({ _id: { $in: ids } }, { status: "inactive" });
        res.json({
          message: "Dishes deactivated successfully",
          data: await Dish.find({ _id: { $in: ids } }).populate(
            "categoryId",
            "name"
          ),
        });
        break;
      default:
        return res.status(400).json({ message: "Invalid type parameter" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const deleteDish = async (req: Request, res: Response) => {
  try {
    const dishId = req.params.id;
    await Dish.updateOne({ _id: dishId }, { deleted: true });
    res.json({
      message: "Dish deleted successfully",
      data: await Dish.findById(dishId).populate("categoryId", "name"),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    console.log("Create dish - Request body:", req.body);
    console.log("Create dish - File:", (req as any).file);

    req.body.price = parseFloat(req.body.price) || 0;
    req.body.rating = parseFloat(req.body.rating) || 0;
    req.body.discount = parseFloat(req.body.discount) || 0;
    req.body.finalPrice =
      req.body.price - (req.body.price * req.body.discount) / 100;
    req.body.prepareTime = parseInt(req.body.prepareTime) || 10;

    // Ensure deleted is always false for new dishes
    const newDish = new Dish(req.body);
    await newDish.save();

    // Populate categoryId before sending response
    const populatedDish = await Dish.findById(newDish._id).populate(
      "categoryId",
      "name"
    );

    console.log("Dish created successfully:", populatedDish);
    res.json({ message: "Dish created successfully", data: populatedDish });
  } catch (error: any) {
    console.error("Error creating dish:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message || error 
    });
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    console.log("Edit dish - Request body:", req.body);
    console.log("Edit dish - Dish ID:", req.params.id);
    console.log("Edit dish - File:", (req as any).file);

    if (req.body.price) req.body.price = parseFloat(req.body.price);
    if (req.body.rating) req.body.rating = parseFloat(req.body.rating);
    if (req.body.discount) req.body.discount = parseFloat(req.body.discount);
    if (req.body.price !== undefined && req.body.discount !== undefined) {
      req.body.finalPrice =
        req.body.price - (req.body.price * req.body.discount) / 100;
    }
    if (req.body.prepareTime)
      req.body.prepareTime = parseInt(req.body.prepareTime);

    await Dish.updateOne({ _id: req.params.id }, req.body);

    // Get updated dish with populated categoryId
    const updatedDish = await Dish.findById(req.params.id).populate(
      "categoryId",
      "name"
    );

    console.log("Dish updated successfully:", updatedDish);
    res.json({ message: "Dish updated successfully", data: updatedDish });
  } catch (error: any) {
    console.error("Error updating dish:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message || error 
    });
  }
};
export const getDishDetail = async (req: Request, res: Response) => {
  try {
    const dishId = req.params.id;
    const dish = await Dish.findOne({ _id: dishId }).populate(
      "categoryId",
      "name description"
    );
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    res.json({ message: "Dish fetched successfully", data: dish });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
