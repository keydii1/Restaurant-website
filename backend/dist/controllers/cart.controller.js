"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editItemQuantityInCart = exports.deleteOneItemFromCart = exports.clearCart = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const dish_model_1 = __importDefault(require("../models/dish.model"));
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        const cart = yield cart_model_1.default.findOne({
            userId: userId,
        });
        if (!cart) {
            return res.status(404).json({ message: "You do not have a cart" });
        }
        res.status(200).json({
            message: "Cart fetched successfully",
            cart: cart,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, dishId, quantity, totalPrice } = req.body;
        let cart = yield cart_model_1.default.findOne({ userId: userId });
        if (!cart) {
            cart = new cart_model_1.default({
                userId: userId,
                items: [{ dishId, quantity }],
                totalPrice: totalPrice,
            });
            yield cart.save();
        }
        else {
            for (const item of cart.items) {
                if (item.dishId === dishId) {
                    item.quantity += quantity;
                    cart.totalPrice += totalPrice;
                    yield cart.save();
                    return res.status(200).json({
                        message: "Cart updated successfully",
                        cart: cart,
                    });
                }
            }
            cart.items.push({ dishId, quantity });
            cart.totalPrice += totalPrice;
            yield cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
                cart: cart,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
});
exports.addToCart = addToCart;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        yield cart_model_1.default.deleteOne({ userId: userId });
        res.status(200).json({ message: "Cart cleared successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
});
exports.clearCart = clearCart;
const deleteOneItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, dishId, quantity } = req.body;
        const cart = yield cart_model_1.default.findOne({
            userId: userId,
        });
        const dish = yield dish_model_1.default.findOne({
            _id: dishId,
        }).select("price");
        if (!cart) {
            return res.status(404).json({ message: "You do not have a cart" });
        }
        for (const item of cart.items) {
            if (item.dishId === dishId) {
                if (item.quantity >= quantity) {
                    item.quantity -= quantity;
                }
                else {
                    return res.status(400).json({
                        message: "Item quantity in cart is less than the quantity to delete",
                    });
                }
                if (item.quantity === 0) {
                    yield cart_model_1.default.updateOne({ userId: userId }, { $pull: { items: { dishId: dishId } } });
                }
                cart.totalPrice -= dish.price * quantity;
                yield cart.save();
                return res.status(200).json({
                    message: "Item deleted from cart successfully",
                    cart: cart,
                });
            }
            else {
                return res.status(404).json({ message: "Item not found in cart" });
            }
        }
        return res.status(404).json({ message: "Item not found in cart" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting item from cart", error });
    }
});
exports.deleteOneItemFromCart = deleteOneItemFromCart;
const editItemQuantityInCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
exports.editItemQuantityInCart = editItemQuantityInCart;
