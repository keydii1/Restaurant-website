import { Request, Response } from "express";
import Table from "../models/table.model";

export const tableNumberRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.tableNumber && req.body.tableNumber !== 0) {
    return res.status(400).json({ message: "Table number is required" });
  }
  next();
};

export const tableNumberValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const tableNumber = req.body.tableNumber;
  if (tableNumber !== undefined && (isNaN(tableNumber) || tableNumber < 1)) {
    return res
      .status(400)
      .json({ message: "Table number must be a positive number" });
  }
  next();
};

export const tableNumberUnique = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const tableNumber = req.body.tableNumber;
  if (tableNumber !== undefined) {
    const existingTable = await Table.findOne({ tableNumber: tableNumber });
    if (existingTable && existingTable._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Table number already exists" });
    }
  }
  next();
};

export const maximumCapacityRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.maximumCapacity && req.body.maximumCapacity !== 0) {
    return res.status(400).json({ message: "Maximum capacity is required" });
  }
  next();
};

export const maximumCapacityValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const maximumCapacity = req.body.maximumCapacity;
  if (
    maximumCapacity !== undefined &&
    (isNaN(maximumCapacity) || maximumCapacity < 1)
  ) {
    return res
      .status(400)
      .json({ message: "Maximum capacity must be a positive number" });
  }
  next();
};

export const statusValid = (req: Request, res: Response, next: Function) => {
  const validStatuses = ["available", "occupied", "reserved"];
  if (req.body.status && !validStatuses.includes(req.body.status)) {
    return res.status(400).json({
      message: "Status must be one of: available, occupied, reserved",
    });
  }
  next();
};

export const positionRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.body.position || req.body.position.trim() === "") {
    return res.status(400).json({ message: "Position is required" });
  }
  next();
};

export const positionLength = (req: Request, res: Response, next: Function) => {
  if (req.body.position && req.body.position.length > 100) {
    return res
      .status(400)
      .json({ message: "Position must not exceed 100 characters" });
  }
  next();
};
