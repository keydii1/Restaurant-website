import { Request, Response } from "express";
import Table from "../models/table.model";
export const getAllTables = async (req: Request, res: Response) => {
  const tables = await Table.find();
  return res.json(tables);
};
export const createTable = async (req: Request, res: Response) => {
  try {
    const newTable = new Table(req.body);
    const savedTable = await newTable.save();
    return res.status(201).json({
      message: "Table created successfully",
      table: savedTable,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
