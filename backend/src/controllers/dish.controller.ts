import express, { Express, Request, Response } from "express";
import Dish from "../models/dish.model";
import dotenv from "dotenv";
dotenv.config();

export const getAllDishes = async (req: Request, res: Response) => {
  try {
    interface DishCondition {
      deleted?: boolean;
      status?: string;
    }

    const findCondition: DishCondition = {};
    const filterStatus = req.query.status as string;
    console.log("Filter Status:", filterStatus);
    if (filterStatus) {
      findCondition.status = filterStatus as string;
    }
    const dishes = await Dish.find(findCondition);
    res.json({ message: "Dishes fetched successfully", data: dishes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
