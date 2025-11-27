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
exports.getDishDetail = exports.edit = exports.create = exports.deleteDish = exports.changeMulti = exports.changeStatus = exports.getDishes = void 0;
const dish_model_1 = __importDefault(require("../models/dish.model"));
const dotenv_1 = __importDefault(require("dotenv"));
const pagination_helper_1 = __importDefault(require("../helpers/pagination.helper"));
dotenv_1.default.config();
const getDishes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findCondition = {
            deleted: false,
        };
        const filterStatus = req.query.status;
        const filterKeyword = req.query.keyword;
        const sortKey = req.query.sortKey;
        const sortValue = req.query.sortValue;
        if (filterStatus) {
            findCondition.status = filterStatus;
        }
        if (filterKeyword) {
            const keywordRegex = new RegExp(filterKeyword, "i");
            findCondition.name = keywordRegex;
        }
        let sortCondition = {};
        if (sortKey && sortValue) {
            sortCondition[sortKey] = sortValue;
        }
        const countDishes = yield dish_model_1.default.countDocuments(findCondition);
        let objectPagination = (0, pagination_helper_1.default)({
            currentPage: 1,
            limit: 10,
        }, req, countDishes);
        const dishes = yield dish_model_1.default.find(findCondition)
            .sort(sortCondition)
            .skip(objectPagination.skip)
            .limit(objectPagination.limit)
            .populate("categoryId", "name");
        res.json({
            message: "Dishes fetched successfully",
            data: {
                dishes: dishes,
                totalPages: objectPagination.totalPages,
                currentPage: objectPagination.currentPage,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getDishes = getDishes;
const changeStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dishId = req.params.id;
        const status = req.params.status;
        yield dish_model_1.default.updateOne({ _id: dishId }, { status: status });
        res.json({
            message: "Dish status updated successfully",
            data: yield dish_model_1.default.findById(dishId).populate("categoryId", "name"),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.changeStatus = changeStatus;
const changeMulti = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.body.type;
        const ids = req.body.ids.split(",");
        switch (type) {
            case "delete":
                yield dish_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true });
                res.json({
                    message: "Dishes deleted successfully",
                    data: yield dish_model_1.default.find({ _id: { $in: ids } }).populate("categoryId", "name"),
                });
                break;
            case "active":
                yield dish_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active" });
                res.json({
                    message: "Dishes activated successfully",
                    data: yield dish_model_1.default.find({ _id: { $in: ids } }).populate("categoryId", "name"),
                });
                break;
            case "inactive":
                yield dish_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive" });
                res.json({
                    message: "Dishes deactivated successfully",
                    data: yield dish_model_1.default.find({ _id: { $in: ids } }).populate("categoryId", "name"),
                });
                break;
            default:
                return res.status(400).json({ message: "Invalid type parameter" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.changeMulti = changeMulti;
const deleteDish = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dishId = req.params.id;
        yield dish_model_1.default.updateOne({ _id: dishId }, { deleted: true });
        res.json({
            message: "Dish deleted successfully",
            data: yield dish_model_1.default.findById(dishId).populate("categoryId", "name"),
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deleteDish = deleteDish;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Create dish - Request body:", req.body);
        console.log("Create dish - File:", req.file);
        req.body.price = parseFloat(req.body.price) || 0;
        req.body.rating = parseFloat(req.body.rating) || 0;
        req.body.discount = parseFloat(req.body.discount) || 0;
        req.body.finalPrice =
            req.body.price - (req.body.price * req.body.discount) / 100;
        req.body.prepareTime = parseInt(req.body.prepareTime) || 10;
        const newDish = new dish_model_1.default(req.body);
        yield newDish.save();
        const populatedDish = yield dish_model_1.default.findById(newDish._id).populate("categoryId", "name");
        console.log("Dish created successfully:", populatedDish);
        res.json({ message: "Dish created successfully", data: populatedDish });
    }
    catch (error) {
        console.error("Error creating dish:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message || error,
        });
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Edit dish - Request body:", req.body);
        console.log("Edit dish - Dish ID:", req.params.id);
        console.log("Edit dish - File:", req.file);
        if (req.body.price)
            req.body.price = parseFloat(req.body.price);
        if (req.body.rating)
            req.body.rating = parseFloat(req.body.rating);
        if (req.body.discount)
            req.body.discount = parseFloat(req.body.discount);
        if (req.body.price !== undefined && req.body.discount !== undefined) {
            req.body.finalPrice =
                req.body.price - (req.body.price * req.body.discount) / 100;
        }
        if (req.body.prepareTime)
            req.body.prepareTime = parseInt(req.body.prepareTime);
        yield dish_model_1.default.updateOne({ _id: req.params.id }, req.body);
        const updatedDish = yield dish_model_1.default.findById(req.params.id).populate("categoryId", "name");
        console.log("Dish updated successfully:", updatedDish);
        res.json({ message: "Dish updated successfully", data: updatedDish });
    }
    catch (error) {
        console.error("Error updating dish:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message || error,
        });
    }
});
exports.edit = edit;
const getDishDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dishId = req.params.id;
        const dish = yield dish_model_1.default.findOne({ _id: dishId }).populate("categoryId", "name description");
        if (!dish) {
            return res.status(404).json({ message: "Dish not found" });
        }
        res.json({ message: "Dish fetched successfully", data: dish });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.getDishDetail = getDishDetail;
