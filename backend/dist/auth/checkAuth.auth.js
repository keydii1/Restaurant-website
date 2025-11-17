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
exports.authAdmin = exports.auth = exports.asyncHandler = void 0;
const tokenServices_1 = require("../utils/auth/tokenServices");
const user_model_1 = __importDefault(require("../models/user.model"));
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader) {
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        else {
            return res.status(401).json({
                code: 401,
                message: "Vui lòng đăng nhập",
            });
        }
        const decoded = yield (0, tokenServices_1.verifyToken)(token);
        req.accessToken = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            code: 401,
            message: "Token không hợp lệ hoặc hết hạn",
            error: error.message,
        });
    }
});
exports.auth = auth;
const authAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }
        if (!token) {
            return res.status(401).json({
                code: 401,
                message: "Bạn không có quyền truy cập",
            });
        }
        const decoded = yield (0, tokenServices_1.verifyToken)(token);
        const { id } = decoded;
        const findUser = yield user_model_1.default.findById(id);
        if (!findUser || findUser.isAdmin === false) {
            return res.status(403).json({
                code: 403,
                message: "Bạn không có quyền truy cập",
            });
        }
        req.accessToken = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            code: 401,
            message: "Token không hợp lệ hoặc hết hạn",
            error: error.message,
        });
    }
});
exports.authAdmin = authAdmin;
