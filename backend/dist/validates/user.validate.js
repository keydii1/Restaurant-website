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
exports.roleValid = exports.emailExistCheck = exports.emailValid = exports.passwordRequirements = exports.usernameNotEmpty = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const usernameNotEmpty = (req, res, next) => {
    if (!req.body.username || req.body.username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
    }
    next();
};
exports.usernameNotEmpty = usernameNotEmpty;
const passwordRequirements = (req, res, next) => {
    const password = req.body.password;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (password && !passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 8 characters long and include at least one letter and one number",
        });
    }
    next();
};
exports.passwordRequirements = passwordRequirements;
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
const roleValid = (req, res, next) => {
    const validRoles = ["admin", "user", "manager"];
    if (req.body.role && !validRoles.includes(req.body.role)) {
        return res
            .status(400)
            .json({ message: "Role must be either admin, user, or manager" });
    }
    next();
};
exports.roleValid = roleValid;
