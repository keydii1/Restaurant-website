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
exports.passwordRequirements = exports.phoneExistCheck = exports.usernameExistCheck = exports.emailExistCheck = exports.emailValid = exports.usernameNotEmpty = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const usernameNotEmpty = (req, res, next) => {
    if (!req.body.username || req.body.username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
    }
    next();
};
exports.usernameNotEmpty = usernameNotEmpty;
const emailValid = (req, res, next) => {
    const email = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format, please enter a email that have to match the format: user@example.com",
        });
    }
    next();
};
exports.emailValid = emailValid;
const emailExistCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    if (email) {
        const existingUser = yield user_model_1.default.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Email already in use, please enter new email" });
        }
    }
    next();
});
exports.emailExistCheck = emailExistCheck;
const usernameExistCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    if (username) {
        const existingUser = yield user_model_1.default.findOne({ username: username });
        if (existingUser) {
            return res.status(400).json({
                message: "Username already in use, please enter new username",
            });
        }
    }
    next();
});
exports.usernameExistCheck = usernameExistCheck;
const phoneExistCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = req.body.phone;
    if (phone) {
        const existingUser = yield user_model_1.default.findOne({ phone: phone });
        if (existingUser) {
            return res.status(400).json({
                message: "Phone number already in use, please enter new phone number",
            });
        }
    }
    next();
});
exports.phoneExistCheck = phoneExistCheck;
const passwordRequirements = (req, res, next) => {
    const password = req.body.password;
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long",
        });
    }
    if (!/[a-z]/.test(password)) {
        return res.status(400).json({
            message: "Password must include at least one lowercase letter",
        });
    }
    if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
            message: "Password must include at least one uppercase letter",
        });
    }
    if (!/\d/.test(password)) {
        return res.status(400).json({
            message: "Password must include at least one number",
        });
    }
    if (!/[@$!%*?&#^()_+\-=\[\]{}|;:'",.<>\/\\]/.test(password)) {
        return res.status(400).json({
            message: "Password must include at least one special character",
        });
    }
    next();
};
exports.passwordRequirements = passwordRequirements;
