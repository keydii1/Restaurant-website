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
export const addToCart = async (req: Request, res: Response) => {
  try {
    req.body.quantity = Number(req.body.quantity);
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const { dishId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: userId });
    const dish = await Dish.findOne({
      _id: dishId,
    }).select("price");
    if (!dish) {
      return new BadRequestError("Dish not found").send(res);
    }
    const totalPrice = dish.price * quantity;
    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [{ dishId, quantity }],
        totalPrice: totalPrice,
      });
      await cart.save();
      return new OK({
        message: "Cart created and item added successfully",
        metadata: cart,
      }).send(res);
    } else {
      const existingItem = cart.items.find(
        (item) => item.dishId.toString() === dishId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
        cart.totalPrice += totalPrice;
        await cart.save();
        return new OK({
          message: "Cart updated successfully",
          metadata: cart,
        }).send(res);
      }
      cart.items.push({ dishId, quantity });
      cart.totalPrice += totalPrice;
      await cart.save();
      return new OK({
        message: "Cart updated successfully",
        metadata: cart,
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
    await Cart.deleteOne({ userId: userId });
    return new OK({
      message: "Cart cleared successfully",
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error clearing cart").send(res);
  }
};
export const changeOneItemFromCart = async (req: Request, res: Response) => {
  try {
    const accesstoken = (req as any).accessToken;
    const userId = accesstoken.id;
    const { dishId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "You do not have a cart" });
    }

    const dish = await Dish.findById(dishId).select("price");
    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    // Tìm item
    const item = cart.items.find((i) => i.dishId.toString() === dishId);
    if (!item) {
      return new BadRequestError("Item not found in cart").send(res);
    }

    // Kiểm tra số lượng
    if (item.quantity < quantity) {
      return new BadRequestError(
        "Item quantity in cart is less than quantity to delete"
      ).send(res);
    }

    // Cập nhật số lượng còn lại
    item.quantity -= quantity;
    cart.totalPrice -= dish.price * quantity;

    // Nếu hết thì xoá item khỏi array
    if (item.quantity === 0) {
      cart.items = cart.items.filter((i) => i.dishId.toString() !== dishId);
    }

    await cart.save();

    return new OK({
      message: "Item deleted from cart successfully",
      metadata: cart,
    }).send(res);
  } catch (error) {
    return new BadRequestError("Error deleting item from cart").send(res);
  }
};
