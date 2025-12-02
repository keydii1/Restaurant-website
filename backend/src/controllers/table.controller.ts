import { Request, Response } from "express";
import Table from "../models/table.model";
import { Created } from "../core/success.response";
import { BadRequestError } from "../core/error.response";
import { OK } from "../core/success.response";

export const getAllTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find({ deleted: false });
    return new OK({
      message: "Fetched all tables successfully",
      metadata: tables,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const createTable = async (req: Request, res: Response) => {
  try {
    const newTable = new Table(req.body);
    await newTable.save();
    return new Created({
      message: "Table created successfully",
      metadata: newTable,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const tableId = req.params.id;
    await Table.updateOne({ _id: tableId }, { deleted: true });
    return new OK({
      message: "Table deleted successfully",
    }).send(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const editTable = async (req: Request, res: Response) => {
  try {
    const tableId = req.params.id;
    const updatedData = req.body;
    const table = await Table.findOne({ _id: tableId, deleted: false });
    const allTable = await Table.find({ deleted: false });
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }
    for (const t of allTable) {
      if (t.tableNumber === updatedData.tableNumber)
        return new BadRequestError("Table number already exists").send(res);

      if (t.position === updatedData.position) {
        return new BadRequestError("Table position already exists").send(res);
      }
    }
    await Table.updateOne({ _id: tableId }, updatedData);
    return new OK({
      message: "Table updated successfully",
      metadata: await Table.findById(tableId),
    }).send(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const changeTableStatus = async (req: Request, res: Response) => {
  try {
    const tableId = req.params.id;
    const status = req.body.status;
    const table = await Table.findOne({ _id: tableId, deleted: false });
    if (!table) {
      return new BadRequestError("Table not found").send(res);
    }
    await Table.updateOne({ _id: tableId }, { status: status });
    return new OK({
      message: "Table status updated successfully",
      metadata: await Table.findById(tableId),
    }).send(res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
