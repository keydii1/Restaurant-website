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
exports.categotyExistCheck = exports.tittleNotMoreThan30Chars = exports.titleNotEmpty = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const titleNotEmpty = (req, res, next) => {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }
    next();
};
exports.titleNotEmpty = titleNotEmpty;
const tittleNotMoreThan30Chars = (req, res, next) => {
    if (req.body.title && req.body.title.length > 30) {
        return res
            .status(400)
            .json({ message: "Title must not exceed 30 characters" });
    }
    next();
};
exports.tittleNotMoreThan30Chars = tittleNotMoreThan30Chars;
const categotyExistCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.body.categoryId;
    if (!categoryId) {
        return res.status(400).json({ message: "Category ID is required" });
    }
    const category = yield category_model_1.default.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    next();
});
exports.categotyExistCheck = categotyExistCheck;
