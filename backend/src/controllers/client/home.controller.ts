import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import Dish from "../../models/dish.model";

export const index = async (req: Request, res: Response) => {
  const dishes = await Dish.find();

  res.json({
    message: "Welcome to the Restaurant API",
    dishes: dishes,
  });
};
