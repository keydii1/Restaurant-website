import express, { Express, Request, Response } from "express";
import Dish from "../models/dish.model";
import dotenv from "dotenv";
dotenv.config();

export const getDishes = async (req: Request, res: Response) => {
  try {
    // define filter conditions
    interface DishCondition {
      deleted?: boolean;
      status?: string;
      name?: RegExp;
    }
    const findCondition: DishCondition = {};
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
    let sortCondition = {};
    if (sortKey && sortValue) {
      sortCondition[sortKey] = sortValue;
    }

    const dishes = await Dish.find(findCondition).sort(sortCondition);
    res.json({ message: "Dishes fetched successfully", data: dishes });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
