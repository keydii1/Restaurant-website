"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyModel = void 0;
const mongoose_1 = require("mongoose");
const apiKeySchema = new mongoose_1.Schema({
    userId: { type: String, required: true, ref: "users" },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
}, { collection: "apiKeys", timestamps: true });
exports.ApiKeyModel = (0, mongoose_1.model)("ApiKey", apiKeySchema);
exports.default = exports.ApiKeyModel;
