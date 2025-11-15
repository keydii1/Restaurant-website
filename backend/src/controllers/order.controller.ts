import { Request, Response } from "express";
import Order from "../models/order.model";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).accessToken.id;
    const orders = await Order.findOne({ userId: userId });
    return new OK({
      message: "Fetch orders successfully",
      metadata: orders,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching orders").send(res);
  }
};
