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
    });
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
      cart.totalPrice += totalPrice;
      await cart.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        cart: cart,
      });
    }
  } catch (error) {
    return new BadRequestError(`Error adding to cart ${error}`).send(res);
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
    const item = cart.items.find((i) => i.dishId === dishId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Kiểm tra số lượng
    if (item.quantity < quantity) {
      return res.status(400).json({
        message: "Item quantity in cart is less than quantity to delete",
      });
    }

    // Cập nhật số lượng còn lại
    item.quantity -= quantity;
    cart.totalPrice -= dish.price * quantity;

    // Nếu hết thì xoá item khỏi array
    if (item.quantity === 0) {
      cart.items = cart.items.filter((i) => i.dishId !== dishId);
    }

    await cart.save();

    return res.status(200).json({
      message: "Item deleted from cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item from cart", error });
  }
};
