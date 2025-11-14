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
exports.editDiscount = exports.deleteDiscount = exports.createDiscount = exports.getAllDiscounts = void 0;
const discount_model_1 = __importDefault(require("../models/discount.model"));
const getAllDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discounts = yield discount_model_1.default.find({
            deleted: false,
        });
        res.status(200).json(discounts);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching discounts", error });
    }
});
exports.getAllDiscounts = getAllDiscounts;
const createDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDiscount = new discount_model_1.default(req.body);
        yield newDiscount.save();
        res.status(201).json({
            message: "Discount created successfully",
            discount: newDiscount,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating discount", error });
    }
});
exports.createDiscount = createDiscount;
const deleteDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield discount_model_1.default.updateOne({ _id: id }, { deleted: true });
        res.status(200).json({ message: "Discount deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting discount", error });
    }
});
exports.deleteDiscount = deleteDiscount;
const editDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield discount_model_1.default.updateOne({ _id: id }, { $set: req.body });
        return res.json({ message: "Discount updated successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error });
    }
});
exports.editDiscount = editDiscount;
