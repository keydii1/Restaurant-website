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
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getAllDiscounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const discounts = yield discount_model_1.default.find({
            deleted: false,
        });
        return new success_response_1.OK({
            message: "Discounts fetched successfully",
            metadata: discounts,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error fetching discounts").send(res);
    }
});
exports.getAllDiscounts = getAllDiscounts;
const createDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDiscount = new discount_model_1.default(req.body);
        yield newDiscount.save();
        return new success_response_1.Created({
            message: "Discount created successfully",
            metadata: newDiscount,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error creating discount").send(res);
    }
});
exports.createDiscount = createDiscount;
const deleteDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield discount_model_1.default.updateOne({ _id: id }, { deleted: true });
        return new success_response_1.OK({
            message: "Discount deleted successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error deleting discount").send(res);
    }
});
exports.deleteDiscount = deleteDiscount;
const editDiscount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield discount_model_1.default.updateOne({ _id: id }, { $set: req.body });
        const updatedDiscount = yield discount_model_1.default.findById(id);
        return new success_response_1.OK({
            message: "Discount updated successfully",
            metadata: updatedDiscount,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating discount").send(res);
    }
});
exports.editDiscount = editDiscount;
