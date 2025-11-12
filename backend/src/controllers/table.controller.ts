import { Request, Response } from "express";
import Table from "../models/table.model";
export const getAllTables = async (req: Request, res: Response) => {
  const tables = await Table.find({
    deleted: false,
  });
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
export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTable = await Table.findOne({ _id: id });
    if (!deletedTable) {
      return res.status(404).json({ message: "Table not found" });
    }
    await Table.updateOne({ _id: id }, { $set: { deleted: true } });
    return res.json({ message: "Table deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const editTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Table.updateOne({ _id: id }, { $set: req.body });
    return res.json({ message: "Table updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
