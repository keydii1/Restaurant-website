"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    dateOfBirth: { type: Date },
    loginMethod: {
        type: String,
        enum: ["manual", "google"],
        default: "manual",
    },
    googleId: { type: String },
    refreshToken: { type: String },
}, {
    timestamps: true,
    collection: "users",
});
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
