import { Response, Request } from "express";
import Discount from "../models/discount.model";

export const getAllDiscounts = async (req: Request, res: Response) => {
  try {
    const discounts = await Discount.find({
      deleted: false,
    });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching discounts", error });
  }
};
export const createDiscount = async (req: Request, res: Response) => {
  try {
    const newDiscount = new Discount(req.body);
    await newDiscount.save();
    res.status(201).json({
      message: "Discount created successfully",
      discount: newDiscount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating discount", error });
  }
};
export const deleteDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Discount.updateOne({ _id: id }, { deleted: true });
    res.status(200).json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting discount", error });
  }
};

export const editDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Discount.updateOne({ _id: id }, { $set: req.body });
    return res.json({ message: "Discount updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
