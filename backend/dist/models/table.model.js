"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tableSchema = new mongoose_1.Schema({
    tableNumber: { type: Number, required: true, unique: true },
    tableName: { type: String },
    maximumCapacity: { type: Number, required: true },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved"],
        default: "available",
    },
    position: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    orderTime: { type: Date },
    finishedTime: { type: Date },
}, {
    timestamps: true,
    collection: "tables",
});
const Table = (0, mongoose_1.model)("Table", tableSchema);
exports.default = Table;
