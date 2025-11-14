"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createRefreshToken = exports.createToken = exports.createApiKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const apiKey_model_1 = require("../../models/apiKey.model");
const jwt_decode_1 = require("jwt-decode");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createApiKey = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync("rsa", {
        modulusLength: 2048,
    });
    const privateKeyString = privateKey.export({
        type: "pkcs8",
        format: "pem",
    });
    const publicKeyString = publicKey.export({
        type: "spki",
        format: "pem",
    });
    const newApiKey = new apiKey_model_1.ApiKeyModel({
        userId,
        publicKey: publicKeyString,
        privateKey: privateKeyString,
    });
    return yield newApiKey.save();
});
exports.createApiKey = createApiKey;
const createToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findApiKey = yield apiKey_model_1.ApiKeyModel.findOne({
        userId: payload.id.toString(),
    });
    if (!(findApiKey === null || findApiKey === void 0 ? void 0 : findApiKey.privateKey)) {
        throw new Error("Private key not found for user");
    }
    return jsonwebtoken_1.default.sign(payload, findApiKey.privateKey, {
        algorithm: "RS256",
        expiresIn: "15m",
    });
});
exports.createToken = createToken;
const createRefreshToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const findApiKey = yield apiKey_model_1.ApiKeyModel.findOne({
        userId: payload.id.toString(),
    });
    if (!(findApiKey === null || findApiKey === void 0 ? void 0 : findApiKey.privateKey)) {
        throw new Error("Private key not found for user");
    }
    return jsonwebtoken_1.default.sign(payload, findApiKey.privateKey, {
        algorithm: "RS256",
        expiresIn: "7d",
    });
});
exports.createRefreshToken = createRefreshToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = (0, jwt_decode_1.jwtDecode)(token);
        const { id } = decoded;
        const findApiKey = yield apiKey_model_1.ApiKeyModel.findOne({ userId: id });
        if (!findApiKey) {
            throw new Error("Please log in again");
        }
        return jsonwebtoken_1.default.verify(token, findApiKey.publicKey, {
            algorithms: ["RS256"],
        });
    }
    catch (error) {
        throw new Error("Please log in again");
    }
});
exports.verifyToken = verifyToken;
