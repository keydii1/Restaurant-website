"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const discountSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    percentage: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    deleted: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
}, {
    timestamps: true,
    collection: "discounts",
});
const Discount = (0, mongoose_1.model)("Discount", discountSchema);
exports.default = Discount;
