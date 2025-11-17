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
exports.changeOneItemFromCart = exports.clearCart = exports.addToCart = exports.getCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const dish_model_1 = __importDefault(require("../models/dish.model"));
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        const cart = yield cart_model_1.default.findOne({
            userId: userId,
        });
        if (!cart) {
            return new error_response_1.BadRequestError("Cart not found").send(res);
        }
        return new success_response_1.OK({
            message: "Fetch cart successfully",
            metadata: cart,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error fetching cart").send(res);
    }
});
exports.getCart = getCart;
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.quantity = Number(req.body.quantity);
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        const { dishId, quantity } = req.body;
        let cart = yield cart_model_1.default.findOne({ userId: userId });
        const dish = yield dish_model_1.default.findOne({
            _id: dishId,
        }).select("price");
        if (!dish) {
            return new error_response_1.BadRequestError("Dish not found").send(res);
        }
        const totalPrice = dish.price * quantity;
        if (!cart) {
            cart = new cart_model_1.default({
                userId: userId,
                items: [{ dishId, quantity }],
                totalPrice: totalPrice,
            });
            yield cart.save();
            return new success_response_1.OK({
                message: "Cart created and item added successfully",
                metadata: cart,
            }).send(res);
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
            cart.totalPrice += totalPrice;
            yield cart.save();
            return res.status(200).json({
                message: "Cart updated successfully",
                cart: cart,
            });
        }
    }
    catch (error) {
        return new error_response_1.BadRequestError(`Error adding to cart ${error}`).send(res);
    }
});
exports.addToCart = addToCart;
const clearCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        yield cart_model_1.default.deleteOne({ userId: userId });
        res.status(200).json({ message: "Cart cleared successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error clearing cart", error });
    }
});
exports.clearCart = clearCart;
const changeOneItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        const { dishId, quantity } = req.body;
        const cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "You do not have a cart" });
        }
        const dish = yield dish_model_1.default.findById(dishId).select("price");
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        const item = cart.items.find((i) => i.dishId === dishId);
        if (!item) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        if (item.quantity < quantity) {
            return res.status(400).json({
                message: "Item quantity in cart is less than quantity to delete",
            });
        }
        item.quantity -= quantity;
        cart.totalPrice -= dish.price * quantity;
        if (item.quantity === 0) {
            cart.items = cart.items.filter((i) => i.dishId !== dishId);
        }
        yield cart.save();
        return res.status(200).json({
            message: "Item deleted from cart successfully",
            cart,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting item from cart", error });
    }
});
exports.changeOneItemFromCart = changeOneItemFromCart;
