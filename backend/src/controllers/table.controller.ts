import { Request, Response } from "express";
import Table from "../models/table.model";
import { Created } from "../../core/success.response";
import { BadRequestError } from "../../core/error.response";
import { OK } from "../../core/success.response";
const statusCodes = require("../../core/statusCodes");
const reasonPhrases = require("../../core/reasonPhrases");

export const getAllTables = async (req: Request, res: Response) => {
  try {
    const tables = await Table.find({
      deleted: false,
    });
    return new OK({
      message: "Tables fetched successfully",
      metadata: tables,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const createTable = async (req: Request, res: Response) => {
  try {
    const newTable = new Table(req.body);
    const savedTable = await newTable.save();
    return new Created({
      message: "Table created successfully",
      metadata: savedTable,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTable = await Table.findOne({ _id: id });
    if (!deletedTable) {
      return new BadRequestError(
        reasonPhrases.NOT_FOUND,
        statusCodes.NOT_FOUND,
        reasonPhrases.NOT_FOUND
      ).send(res);
    }
    await Table.updateOne({ _id: id }, { $set: { deleted: true } });
    return new OK({
      message: "Table deleted successfully",
      metadata: deletedTable,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const editTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedTable) {
      return new BadRequestError(
        reasonPhrases.NOT_FOUND,
        statusCodes.NOT_FOUND,
        reasonPhrases.NOT_FOUND
      ).send(res);
    }

    return new OK({
      message: "Table updated successfully",
      metadata: updatedTable,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};

export const changeTableStatus = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.params;
    const validStatuses = ["available", "occupied", "reserved"];

    if (!validStatuses.includes(status)) {
      return new BadRequestError(
        "Invalid status value. Valid values: " + validStatuses.join(", "),
        statusCodes.BAD_REQUEST,
        reasonPhrases.BAD_REQUEST
      ).send(res);
    }

    const updatedTable = await Table.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedTable) {
      return new BadRequestError(
        reasonPhrases.NOT_FOUND,
        statusCodes.NOT_FOUND,
        reasonPhrases.NOT_FOUND
      ).send(res);
    }

    return new OK({
      message: "Table status updated successfully",
      metadata: updatedTable,
    }).send(res);
  } catch (error) {
    return new BadRequestError().send(res);
  }
};
