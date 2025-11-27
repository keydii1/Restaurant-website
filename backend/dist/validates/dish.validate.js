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
exports.categotyExistCheck = exports.tittleNotMoreThan30Chars = exports.titleNotEmpty = exports.descriptionValid = exports.categoryExistCheck = exports.prepareTimeValid = exports.ratingValid = exports.discountValid = exports.priceValid = exports.nameNotMoreThan100Chars = exports.nameNotEmpty = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const nameNotEmpty = (req, res, next) => {
    if (!req.body.name || req.body.name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }
    next();
};
exports.nameNotEmpty = nameNotEmpty;
const nameNotMoreThan100Chars = (req, res, next) => {
    if (req.body.name && req.body.name.length > 100) {
        return res
            .status(400)
            .json({ message: "Name must not exceed 100 characters" });
    }
    next();
};
exports.nameNotMoreThan100Chars = nameNotMoreThan100Chars;
const priceValid = (req, res, next) => {
    const price = parseFloat(req.body.price);
    if (req.body.price !== undefined && (isNaN(price) || price < 0)) {
        return res
            .status(400)
            .json({ message: "Price must be a valid positive number" });
    }
    next();
};
exports.priceValid = priceValid;
const discountValid = (req, res, next) => {
    const discount = parseFloat(req.body.discount);
    if (req.body.discount !== undefined &&
        (isNaN(discount) || discount < 0 || discount > 100)) {
        return res
            .status(400)
            .json({ message: "Discount must be between 0 and 100" });
    }
    next();
};
exports.discountValid = discountValid;
const ratingValid = (req, res, next) => {
    const rating = parseFloat(req.body.rating);
    if (req.body.rating !== undefined &&
        (isNaN(rating) || rating < 0 || rating > 5)) {
        return res.status(400).json({ message: "Rating must be between 0 and 5" });
    }
    next();
};
exports.ratingValid = ratingValid;
const prepareTimeValid = (req, res, next) => {
    const prepareTime = parseInt(req.body.prepareTime);
    if (req.body.prepareTime !== undefined &&
        (isNaN(prepareTime) || prepareTime < 0)) {
        return res
            .status(400)
            .json({ message: "Prepare time must be a valid positive number" });
    }
    next();
};
exports.prepareTimeValid = prepareTimeValid;
const categoryExistCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.body.categoryId;
    if (!categoryId) {
        return res.status(400).json({ message: "Category ID is required" });
    }
    try {
        const category = yield category_model_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        next();
    }
    catch (error) {
        return res.status(400).json({ message: "Invalid category ID format" });
    }
});
exports.categoryExistCheck = categoryExistCheck;
const descriptionValid = (req, res, next) => {
    if (req.body.description && req.body.description.length > 1000) {
        return res
            .status(400)
            .json({ message: "Description must not exceed 1000 characters" });
    }
    next();
};
exports.descriptionValid = descriptionValid;
exports.titleNotEmpty = exports.nameNotEmpty;
exports.tittleNotMoreThan30Chars = exports.nameNotMoreThan100Chars;
exports.categotyExistCheck = exports.categoryExistCheck;
