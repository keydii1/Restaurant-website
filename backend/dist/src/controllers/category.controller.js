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
exports.changeStatus = exports.changeMulti = exports.Delete = exports.edit = exports.create = exports.getCategories = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const success_response_1 = require("../../core/success.response");
const error_response_1 = require("../../core/error.response");
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find();
        return new success_response_1.OK({
            message: "Categories fetched successfully",
            metadata: categories,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getCategories = getCategories;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCategory = new category_model_1.default(req.body);
        yield newCategory.save();
        return new success_response_1.OK({
            message: "Category created successfully",
            metadata: newCategory,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield category_model_1.default.updateOne({ _id: id }, req.body);
        return new success_response_1.OK({
            message: "Category updated successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.edit = edit;
const Delete = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield category_model_1.default.deleteOne({ _id: id }, { deleted: true });
        return new success_response_1.OK({
            message: "Category deleted successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.Delete = Delete;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.body.type;
        const ids = req.body.ids.split(",");
        switch (type) {
            case "delete":
                yield category_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true });
                res.json({ message: "Categories deleted successfully" });
                break;
            case "active":
                yield category_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active" });
                return new success_response_1.OK({
                    message: "Categories activated successfully",
                }).send(res);
                break;
            case "inactive":
                yield category_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive" });
                return new success_response_1.OK({
                    message: "Categories deactivated successfully",
                }).send(res);
                break;
            default:
                return res.status(400).json({ message: "Invalid type parameter" });
        }
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.changeMulti = changeMulti;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const status = req.params.status;
        yield category_model_1.default.updateOne({ _id: categoryId }, { status: status });
        return new success_response_1.OK({
            message: "Category status updated successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.changeStatus = changeStatus;
