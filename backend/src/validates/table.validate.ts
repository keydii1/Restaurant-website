import { Request, Response } from "express";
import Table from "../models/table.model";

export const tableNumberRequired = (
  req: Request,
  res: Response,
  next: Function
) => {
  // explicitly check for undefined so `0` is treated as a provided value if needed
  if (req.body.tableNumber === undefined) {
    return res.status(400).json({ message: "Table number is required" });
  }
  next();
};

export const tableNumberValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const raw = req.body.tableNumber;
  if (raw !== undefined) {
    const tableNumber = Number(raw);
    if (
      isNaN(tableNumber) ||
      !Number.isInteger(tableNumber) ||
      tableNumber < 1
    ) {
      return res
        .status(400)
        .json({ message: "Table number must be an integer >= 1" });
    }
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
    // only consider non-deleted tables for uniqueness check so soft-deleted
    // records don't block re-use of a tableNumber (adjust if you prefer otherwise)
    const existingTable = await Table.findOne({
      tableNumber: tableNumber,
      deleted: false,
    });
    // when updating, allow same record id
    if (
      existingTable &&
      existingTable._id.toString() !== (req.params.id || "")
    ) {
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
  if (req.body.maximumCapacity === undefined) {
    return res.status(400).json({ message: "Maximum capacity is required" });
  }
  next();
};

export const maximumCapacityValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  const raw = req.body.maximumCapacity;
  if (raw !== undefined) {
    const maximumCapacity = Number(raw);
    if (
      isNaN(maximumCapacity) ||
      !Number.isInteger(maximumCapacity) ||
      maximumCapacity < 1
    ) {
      return res
        .status(400)
        .json({ message: "Maximum capacity must be an integer >= 1" });
    }
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
  if (
    req.body.position === undefined ||
    (typeof req.body.position === "string" && req.body.position.trim() === "")
  ) {
    return res.status(400).json({ message: "Position is required" });
  }
  next();
};

export const positionLength = (req: Request, res: Response, next: Function) => {
  if (
    req.body.position &&
    typeof req.body.position === "string" &&
    req.body.position.length > 100
  ) {
    return res
      .status(400)
      .json({ message: "Position must not exceed 100 characters" });
  }
  next();
};

// optional: validate tableName length if provided
export const tableNameLength = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (
    req.body.tableName &&
    typeof req.body.tableName === "string" &&
    req.body.tableName.length > 100
  ) {
    return res
      .status(400)
      .json({ message: "Table name must not exceed 100 characters" });
  }
  next();
};

// optional: validate orderTime if provided (must be a valid date)
export const orderTimeValid = (req: Request, res: Response, next: Function) => {
  if (
    req.body.orderTime !== undefined &&
    req.body.orderTime !== null &&
    req.body.orderTime !== ""
  ) {
    const parsed = Date.parse(req.body.orderTime);
    if (isNaN(parsed)) {
      return res
        .status(400)
        .json({ message: "orderTime must be a valid date/time" });
    }
  }
  next();
};

// validate finishedTime: must be a valid date and not before orderTime (if both provided)
export const finishedTimeValid = (
  req: Request,
  res: Response,
  next: Function
) => {
  if (
    req.body.finishedTime !== undefined &&
    req.body.finishedTime !== null &&
    req.body.finishedTime !== ""
  ) {
    const parsedFinished = Date.parse(req.body.finishedTime);
    if (isNaN(parsedFinished)) {
      return res
        .status(400)
        .json({ message: "finishedTime must be a valid date/time" });
    }

    // if orderTime provided, ensure finishedTime is not before orderTime
    if (
      req.body.orderTime !== undefined &&
      req.body.orderTime !== null &&
      req.body.orderTime !== ""
    ) {
      const parsedOrder = Date.parse(req.body.orderTime);
      if (!isNaN(parsedOrder) && parsedFinished < parsedOrder) {
        return res.status(400).json({
          message: "finishedTime must be the same or after orderTime",
        });
      }
    }
  }
  next();
};
