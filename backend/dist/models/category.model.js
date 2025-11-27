"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const categorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
    status: { type: String },
    images: { type: String, default: "" },
}, { collection: "categories", timestamps: true });
const Category = (0, mongoose_1.model)("Category", categorySchema);
exports.default = Category;
