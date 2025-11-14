"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    maximumCapacity: { type: Number, required: true },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved"],
        required: true,
    },
    position: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    reserved: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: "tables",
});
const Table = (0, mongoose_1.model)("Table", tableSchema);
exports.default = Table;
