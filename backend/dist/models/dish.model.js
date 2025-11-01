"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dishSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    category: { type: String, required: true },
    status: { type: String, required: true },
    finalPrice: { type: Number, required: true },
    rating: { type: Number, default: 0 },
}, { collection: "dishes", timestamps: true });
const Dish = (0, mongoose_1.model)("Dish", dishSchema);
exports.default = Dish;
