import { Request, Response } from "express";
import Order from "../models/order.model";
import { OK, Created } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    return new OK({
      message: "Fetch all orders successfully",
      metadata: orders,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching orders").send(res);
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).accessToken.id;
    const orders = await Order.find({ userId: userId })
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    return new OK({
      message: "Fetch orders successfully",
      metadata: orders,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching orders").send(res);
  }
};

export const GetOrderDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    if (!order) {
      return new BadRequestError("Order not found").send(res);
    }
    return new OK({
      message: "Fetch order successfully",
      metadata: order,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching order").send(res);
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).accessToken.id;
    const newOrder = new Order({
      ...req.body,
      userId: userId,
    });
    await newOrder.save();
    const populatedOrder = await Order.findById(newOrder._id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    return new Created({
      message: "Order created successfully",
      metadata: populatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error creating order").send(res);
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Order.updateOne({ _id: id }, { $set: req.body });
    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    return new OK({
      message: "Order updated successfully",
      metadata: updatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating order").send(res);
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Order.updateOne({ _id: id }, { status: status });
    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    return new OK({
      message: "Order status updated successfully",
      metadata: updatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating order status").send(res);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { payed } = req.body;
    await Order.updateOne({ _id: id }, { payed: payed });
    const updatedOrder = await Order.findById(id)
      .populate("userId", "username email")
      .populate("tableId", "tableNumber status");
    return new OK({
      message: "Payment status updated successfully",
      metadata: updatedOrder,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating payment status").send(res);
  }
};
