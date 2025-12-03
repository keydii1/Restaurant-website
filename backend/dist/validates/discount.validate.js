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
exports.dateValid = exports.dateRequired = exports.percentageValid = exports.percentageRequired = exports.codeUnique = exports.codeLength = exports.codeRequired = void 0;
const discount_model_1 = __importDefault(require("../models/discount.model"));
const codeRequired = (req, res, next) => {
    if (!req.body.code || req.body.code.trim() === "") {
        return res.status(400).json({ message: "Discount code is required" });
    }
    next();
};
exports.codeRequired = codeRequired;
const codeLength = (req, res, next) => {
    if (req.body.code && req.body.code.length > 50) {
        return res
            .status(400)
            .json({ message: "Discount code must not exceed 50 characters" });
    }
    next();
};
exports.codeLength = codeLength;
const codeUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    if (code) {
        const existingDiscount = yield discount_model_1.default.findOne({ code: code });
        if (existingDiscount) {
            return res.status(400).json({ message: "Discount code already exists" });
        }
    }
    next();
});
exports.codeUnique = codeUnique;
const percentageRequired = (req, res, next) => {
    if (req.body.percentage === undefined || req.body.percentage === null) {
        return res.status(400).json({ message: "Percentage is required" });
    }
    next();
};
exports.percentageRequired = percentageRequired;
const percentageValid = (req, res, next) => {
    const percentage = req.body.percentage;
    if (percentage !== undefined &&
        (isNaN(percentage) || percentage < 0 || percentage > 100)) {
        return res
            .status(400)
            .json({ message: "Percentage must be between 0 and 100" });
    }
    next();
};
exports.percentageValid = percentageValid;
const dateRequired = (req, res, next) => {
    if (!req.body.validFrom) {
        return res.status(400).json({ message: "Valid from date is required" });
    }
    if (!req.body.validTo) {
        return res.status(400).json({ message: "Valid to date is required" });
    }
    next();
};
exports.dateRequired = dateRequired;
const dateValid = (req, res, next) => {
    if (req.body.validFrom && req.body.validTo) {
        const validFrom = new Date(req.body.validFrom);
        const validTo = new Date(req.body.validTo);
        if (isNaN(validFrom.getTime())) {
            return res.status(400).json({ message: "Invalid validFrom date format" });
        }
        if (isNaN(validTo.getTime())) {
            return res.status(400).json({ message: "Invalid validTo date format" });
        }
        if (validFrom >= validTo) {
            return res
                .status(400)
                .json({ message: "Valid from date must be before valid to date" });
        }
    }
    next();
};
exports.dateValid = dateValid;
