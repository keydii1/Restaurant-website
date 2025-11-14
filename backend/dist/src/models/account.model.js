"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const mongoose_1 = require("mongoose");
const accountSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role_id: { type: String },
    avatar: { type: String },
    deleted: { type: Boolean, default: false },
    token: { type: String },
    status: { type: String, default: "active" },
});
exports.Account = (0, mongoose_1.model)("Account", accountSchema);
exports.default = exports.Account;
