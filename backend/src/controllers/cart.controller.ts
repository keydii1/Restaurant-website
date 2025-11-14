import { Response, Request } from "express";
import Cart from "../models/cart.model";
import Dish from "../models/dish.model";

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const cart = await Cart.findOne({
      userId: userId,
    });
    if (!cart) {
      return res.status(404).json({ message: "You do not have a cart" });
    }
    res.status(200).json({
      message: "Cart fetched successfully",
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};
export const addToCart = async (req: Request, res: Response) => {
  try {
    const { userId, dishId, quantity, totalPrice } = req.body;
    let cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: [{ dishId, quantity }],
        totalPrice: totalPrice,
      });
      await cart.save();
    } else {
      for (const item of cart.items) {
        if (item.dishId === dishId) {
          item.quantity += quantity;
          cart.totalPrice += totalPrice;
          await cart.save();
          return res.status(200).json({
            message: "Cart updated successfully",
            cart: cart,
          });
        }
      }
      cart.items.push({ dishId, quantity });
      cart.totalPrice += totalPrice;
      await cart.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cart: cart,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};
export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    await Cart.deleteOne({ userId: userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error });
  }
};
export const deleteOneItemFromCart = async (req: Request, res: Response) => {
  try {
    const { userId, dishId, quantity } = req.body;
    const cart = await Cart.findOne({
      userId: userId,
    });
    const dish = await Dish.findOne({
      _id: dishId,
    }).select("price");
    if (!cart) {
      return res.status(404).json({ message: "You do not have a cart" });
    }
    for (const item of cart.items) {
      if (item.dishId === dishId) {
        if (item.quantity >= quantity) {
          item.quantity -= quantity;
        } else {
          return res.status(400).json({
            message:
              "Item quantity in cart is less than the quantity to delete",
          });
        }
        if (item.quantity === 0) {
          await Cart.updateOne(
            { userId: userId },
            { $pull: { items: { dishId: dishId } } }
          );
        }
        cart.totalPrice -= dish.price * quantity;
        await cart.save();
        return res.status(200).json({
          message: "Item deleted from cart successfully",
          cart: cart,
        });
      } else {
        return res.status(404).json({ message: "Item not found in cart" });
      }
    }
    return res.status(404).json({ message: "Item not found in cart" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item from cart", error });
  }
};
export const editItemQuantityInCart = async (req: Request, res: Response) => {};
