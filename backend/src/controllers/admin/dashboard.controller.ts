import { Response, Request } from "express";
import dotenv from "dotenv";
dotenv.config();
import Dish from "../../models/dish.model";
export const index = async (req: Request, res: Response) => {
  try {
    const dist = await Dish.find();
    res.json({ message: "Dashboard data fetched successfully", data: dist });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
