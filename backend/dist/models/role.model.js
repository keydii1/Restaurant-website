"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    permisstion: { type: [String], default: [] },
    deleted: { type: Boolean, default: false },
}, { collection: "roles", timestamps: true });
const Role = (0, mongoose_1.model)("Role", roleSchema);
exports.default = Role;
