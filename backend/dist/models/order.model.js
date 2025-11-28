"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    cartId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tableId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Table",
    },
    totalPrice: { type: Number },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        required: true,
        default: "pending",
    },
    deleveryAddress: { type: String },
    deliveryOptions: {
        type: String,
        enum: ["delivery", "pickup", "dine-in"],
        default: "dine-in",
    },
    typeOfPayment: {
        type: String,
        enum: ["cash", "card", "momo"],
    },
}, { timestamps: true, collection: "orders" });
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
