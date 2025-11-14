"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    items: [
        {
            dishId: { type: String, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    totalPrice: { type: Number, required: true },
}, { timestamps: true, collection: "carts" });
const Cart = (0, mongoose_1.model)("Cart", cartSchema);
exports.default = Cart;
