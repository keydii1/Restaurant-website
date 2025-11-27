"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const generate_helper_1 = require("../helpers/generate.helper");
const orderSchema = new mongoose_1.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD-${Date.now()}-${(0, generate_helper_1.generateRandomNumber)(10)}`,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tableId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Table" },
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, default: "pending" },
    typeOfPayment: { type: String },
    payed: { type: Boolean, required: true, default: false },
}, { timestamps: true, collection: "orders" });
const Order = (0, mongoose_1.model)("Order", orderSchema);
exports.default = Order;
