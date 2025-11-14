"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.login = exports.register = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const GenerateHelper = __importStar(require("../helpers/generate.helper"));
const sendMailForgotPasswords_1 = __importDefault(require("../utils/SendMail/sendMailForgotPasswords"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const tokenServices_1 = require("../utils/auth/tokenServices");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        res.json({
            code: 200,
            message: "Success",
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error,
        });
    }
});
exports.getUsers = getUsers;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield user_model_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                message: "User already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            username,
            email,
            password: hashedPassword,
            isAdmin: false,
        });
        yield newUser.save();
        yield (0, tokenServices_1.createApiKey)(newUser._id.toString());
        res.status(201).json({
            code: 201,
            message: "User registered successfully",
            data: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({
                code: 401,
                message: "Email or password is incorrect",
            });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                code: 401,
                message: "Email or password is incorrect",
            });
        }
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        const token = yield (0, tokenServices_1.createToken)(payload);
        console.log("Generated token:", token);
        const refreshToken = yield (0, tokenServices_1.createRefreshToken)(payload);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        res.json({
            code: 200,
            message: "Login successful",
            data: {
                token,
                refreshToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User with this email does not exist",
            });
        }
        const otpCode = GenerateHelper.generateOTP();
        const otpEntry = new otp_model_1.default({
            userId: user._id,
            code: otpCode,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        yield otpEntry.save();
        const subject = "Password Reset OTP";
        const text = `Your OTP for password reset is: ${otpCode}. It is valid for 5 minutes.`;
        yield (0, sendMailForgotPasswords_1.default)(email, otpCode);
        res.json({
            code: 200,
            message: "OTP sent to email successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User with this email does not exist",
            });
        }
        const otpEntry = yield otp_model_1.default.findOne({ userId: user._id, code: otp });
        if (!otpEntry) {
            return res.status(400).json({
                code: 400,
                message: "Invalid OTP",
            });
        }
        if (otpEntry.expiresAt < new Date()) {
            yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
            return res.status(400).json({
                code: 400,
                message: "OTP has expired",
            });
        }
        yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
        res.json({
            code: 200,
            message: "OTP verified successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                code: 404,
                message: "User with this email does not exist",
            });
        }
        const otpEntry = yield otp_model_1.default.findOne({ userId: user._id, code: otp });
        if (!otpEntry) {
            return res.status(400).json({
                code: 400,
                message: "Invalid OTP",
            });
        }
        if (otpEntry.expiresAt < new Date()) {
            yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
            return res.status(400).json({
                code: 400,
                message: "OTP has expired",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
        res.json({
            code: 200,
            message: "Password reset successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            code: 500,
            message: "Internal server error",
            error: error.message,
        });
    }
});
exports.resetPassword = resetPassword;
