import { Request, Response } from "express";
import Table from "../models/table.model";
import Order from "../models/order.model";
import { Created } from "../core/success.response";
import { BadRequestError } from "../core/error.response";
import { OK } from "../core/success.response";

export const getAvailableTables = async (req: Request, res: Response) => {
  try {
    const { date, startTime, endTime } = req.query;

    if (!date || !startTime || !endTime) {
      const tables = await Table.find({ deleted: false });
      return new OK({
        message: "Fetched all tables successfully",
        metadata: tables,
      }).send(res);
    }
    const requestedStart = new Date(`${date}T${startTime}:00`);
    const requestedEnd = new Date(`${date}T${endTime}:00`);

    const conflictingOrders = await Order.find({
      deliveryOptions: "dine-in",
      status: { $nin: ["cancelled", "completed"] },
      tableId: { $exists: true },
      $or: [
        {
          bookingTime: { $lt: requestedEnd },
        },
      ],
    }).populate("tableId");
    const conflictingTableIds = new Set<string>();

    for (const order of conflictingOrders) {
      if (!order.tableId) continue;

      const orderStart = new Date(
        order.bookingTime || order.timeOrdered || new Date()
      );
      const orderEnd = (order.tableId as any).finishedTime
        ? new Date((order.tableId as any).finishedTime)
        : new Date(orderStart.getTime() + 2 * 60 * 60 * 1000);
      if (orderStart < requestedEnd && orderEnd > requestedStart) {
        conflictingTableIds.add((order.tableId as any)._id.toString());
      }
    }
    const allTables = await Table.find({ deleted: false });
    const tablesWithAvailability = allTables.map((table) => ({
      ...table.toObject(),
      isAvailable: !conflictingTableIds.has(table._id.toString()),
    }));

    return new OK({
      message: "Fetched tables with availability successfully",
      metadata: tablesWithAvailability,
    }).send(res);
  } catch (error) {
    console.error("Error fetching available tables:", error);
    return new BadRequestError("Error fetching available tables").send(res);
  }
};

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
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
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
