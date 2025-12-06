import { Response, Request } from "express";
import Cart from "../models/cart.model";
import Dish from "../models/dish.model";
import { OK } from "../core/success.response";
import { BadRequestError } from "../core/error.response";

export const getCart = async (req: Request, res: Response) => {
  try {
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const cart = await Cart.findOne({
      userId: userId,
      status: "active",
    })
      .populate("items.dishId", "name price image")
      .populate("userId", "username email");
    if (!cart) {
      return new BadRequestError("Cart not found").send(res);
    }
    return new OK({
      message: "Fetch cart successfully",
      metadata: cart,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching cart").send(res);
  }
};
export const getAllcartByUser = async (req: Request, res: Response) => {
  try {
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const carts = await Cart.find({
      userId: userId,
    })
      .populate("items.dishId", "name price image")
      .populate("userId", "username email");
    return new OK({
      message: "Fetch all carts by user successfully",
      metadata: carts,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error fetching carts").send(res);
  }
};
export const addToCart = async (req: Request, res: Response) => {
  try {
    req.body.quantity = Number(req.body.quantity);
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const { dishId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: userId, status: "active" });
    const dish = await Dish.findOne({
      _id: dishId,
    }).select("price");
    if (!dish) {
      return new BadRequestError("Dish not found").send(res);
    }
    const totalPriceOfCurrentItem = dish.price * quantity;
    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [{ dishId, quantity }],
        totalPrice: totalPriceOfCurrentItem,
        status: "active",
      });
      await cart.save();
      const information = await Cart.findOne({
        userId: userId,
        status: "active",
      })
        .populate("items.dishId", "name price image")
        .populate("userId", "username email");
      return new OK({
        message: "Cart created and item added successfully",
        metadata: information,
      }).send(res);
    } else {
      const existingItem = cart.items.find(
        (item) => item.dishId.toString() === dishId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        cart.totalPrice += totalPriceOfCurrentItem;
        await cart.save();
        const information = await Cart.findOne({
          userId: userId,
          status: "active",
        })
          .populate("items.dishId", "name price image")
          .populate("userId", "username email");
        return new OK({
          message: "Cart updated successfully",
          metadata: information,
        }).send(res);
      }
      cart.items.push({ dishId, quantity });
      cart.totalPrice += totalPriceOfCurrentItem;
      await cart.save();
      const information = await Cart.findOne({
        userId: userId,
        status: "active",
      })
        .populate("items.dishId", "name price image")
        .populate("userId", "username email");
      return new OK({
        message: "Cart updated successfully",
        metadata: information,
      }).send(res);
    }
  } catch (error) {
    return new BadRequestError(`Error adding to cart ${error}`).send(res);
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    await Cart.updateOne(
      { userId: userId, status: "active" },
      { status: "cleared" }
    );
    return new OK({
      message: "Cart cleared successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error clearing cart").send(res);
  }
};

export const changeOneItemFromCart = async (req: Request, res: Response) => {
  try {
    req.body.quantity = Number(req.body.quantity);
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const { dishId, quantity } = req.body;

    const cart = await Cart.findOne({ userId: userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "You do not have a cart" });
    }
    const dish = await Dish.findById(dishId).select("price");
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }
    const existingItem = cart.items.find(
      (item) => item.dishId.toString() === dishId
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found in your cart" });
    }
    const oldTotalPriceOfItem = dish.price * existingItem.quantity;
    existingItem.quantity = quantity;
    const newTotalPriceOfItem = dish.price * quantity;
    cart.totalPrice =
      cart.totalPrice - oldTotalPriceOfItem + newTotalPriceOfItem;
    await cart.save();
    const information = await Cart.findOne({ userId: userId, status: "active" })
      .populate("items.dishId", "name price image")
      .populate("userId", "username email");
    return new OK({
      message: "Item quantity updated successfully",
      metadata: information,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error updating item quantity").send(res);
  }
};

export const removeOneItemFromCart = async (req: Request, res: Response) => {
  try {
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const dishId = req.body.dishId;
    const cart = await Cart.findOne({ userId: userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "You do not have a cart" });
    }
    const itemPrice = await Dish.findById(dishId).select("price");
    const quantityItem = cart.items.find(
      (item) => item.dishId.toString() === dishId
    ).quantity;
    const finalPrice = itemPrice.price * quantityItem;
    cart.totalPrice -= finalPrice;
    cart.items = cart.items.filter((i) => i.dishId.toString() !== dishId);
    await cart.save();
    const infomation = await Cart.findOne({ userId: userId, status: "active" })
      .populate("items.dishId", "name price image")
      .populate("userId", "username email");
    return new OK({
      message: "Item removed from cart successfully",
      metadata: infomation,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error removing item from cart").send(res);
  }
};
