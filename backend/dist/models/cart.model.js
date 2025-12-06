"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            dishId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Dish", required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "active" },
}, { timestamps: true, collection: "carts" });
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;
