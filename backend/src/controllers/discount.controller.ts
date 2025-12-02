import { Response, Request } from "express";
import Discount from "../models/discount.model";
import { OK, Created } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getCurrentDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find({
      deleted: false,
    });
    return new OK({
      message: "Discounts fetched successfully",
      metadata: discounts,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching discounts").send(res);
  }
};
export const getAllDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find();
    return new OK({
      message: "All discounts fetched successfully",
      metadata: discounts,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching all discounts").send(res);
  }
};
export const createDiscount = async (req: Request, res: Response) => {
  try {
    const newDiscount = new Discount(req.body);
    await newDiscount.save();
    return new Created({
      message: "Discount created successfully",
      metadata: newDiscount,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error creating discount").send(res);
  }
};

export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Discount.updateOne({ _id: id }, { deleted: true });
    return new OK({
      message: "Discount deleted successfully",
      metadata: await Discount.findById(id),
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error deleting discount").send(res);
  }
};

export const editDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Discount.updateOne({ _id: id }, { $set: req.body });
    const updatedDiscount = await Discount.findById(id);
    return new OK({
      message: "Discount updated successfully",
      metadata: updatedDiscount,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating discount").send(res);
  }
};
