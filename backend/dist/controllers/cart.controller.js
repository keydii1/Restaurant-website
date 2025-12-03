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
exports.removeOneItemFromCart = exports.changeOneItemFromCart = exports.clearCart = exports.addToCart = exports.getCart = void 0;
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
        })
            .populate("items.dishId", "name price image")
            .populate("userId", "username email");
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
        const totalPriceOfCurrentItem = dish.price * quantity;
        if (!cart) {
            cart = new cart_model_1.default({
                userId: userId,
                items: [{ dishId, quantity }],
                totalPrice: totalPriceOfCurrentItem,
            });
            yield cart.save();
            const information = yield cart_model_1.default.findOne({ userId: userId })
                .populate("items.dishId", "name price image")
                .populate("userId", "username email");
            return new success_response_1.OK({
                message: "Cart created and item added successfully",
                metadata: information,
            }).send(res);
        }
        else {
            const existingItem = cart.items.find((item) => item.dishId.toString() === dishId);
            if (existingItem) {
                existingItem.quantity += quantity;
                cart.totalPrice += totalPriceOfCurrentItem;
                yield cart.save();
                const information = yield cart_model_1.default.findOne({ userId: userId })
                    .populate("items.dishId", "name price image")
                    .populate("userId", "username email");
                return new success_response_1.OK({
                    message: "Cart updated successfully",
                    metadata: information,
                }).send(res);
            }
            cart.items.push({ dishId, quantity });
            cart.totalPrice += totalPriceOfCurrentItem;
            yield cart.save();
            const information = yield cart_model_1.default.findOne({ userId: userId })
                .populate("items.dishId", "name price image")
                .populate("userId", "username email");
            return new success_response_1.OK({
                message: "Cart updated successfully",
                metadata: information,
            }).send(res);
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
        return new success_response_1.OK({
            message: "Cart cleared successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error clearing cart").send(res);
    }
});
exports.clearCart = clearCart;
const changeOneItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.quantity = Number(req.body.quantity);
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
        const existingItem = cart.items.find((item) => item.dishId.toString() === dishId);
        if (!existingItem) {
            return res.status(404).json({ message: "Item not found in your cart" });
        }
        const oldTotalPriceOfItem = dish.price * existingItem.quantity;
        existingItem.quantity = quantity;
        const newTotalPriceOfItem = dish.price * quantity;
        cart.totalPrice =
            cart.totalPrice - oldTotalPriceOfItem + newTotalPriceOfItem;
        yield cart.save();
        const information = yield cart_model_1.default.findOne({ userId })
            .populate("items.dishId", "name price image")
            .populate("userId", "username email");
        return new success_response_1.OK({
            message: "Item quantity updated successfully",
            metadata: information,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating item quantity").send(res);
    }
});
exports.changeOneItemFromCart = changeOneItemFromCart;
const removeOneItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        const dishId = req.body.dishId;
        const cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "You do not have a cart" });
        }
        const itemPrice = yield dish_model_1.default.findById(dishId).select("price");
        const quantityItem = cart.items.find((item) => item.dishId.toString() === dishId).quantity;
        const finalPrice = itemPrice.price * quantityItem;
        cart.totalPrice -= finalPrice;
        cart.items = cart.items.filter((i) => i.dishId.toString() !== dishId);
        yield cart.save();
        const infomation = yield cart_model_1.default.findOne({ userId })
            .populate("items.dishId", "name price image")
            .populate("userId", "username email");
        return new success_response_1.OK({
            message: "Item removed from cart successfully",
            metadata: infomation,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error removing item from cart").send(res);
    }
});
exports.removeOneItemFromCart = removeOneItemFromCart;
