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
    image: {
        type: String,
        default: "",
    },
    category: { type: String, default: "" },
    status: { type: String, default: "inactive" },
    finalPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    bestSeller: { type: Boolean, default: false },
    prepareTime: { type: Number, default: 10 },
    ingredients: { type: [String], default: [] },
}, { collection: "dishes", timestamps: true });
const Dish = (0, mongoose_1.model)("Dish", dishSchema);
exports.default = Dish;
