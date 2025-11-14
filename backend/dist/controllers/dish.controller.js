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
        const findCondition = {};
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
            .limit(objectPagination.limit);
        res.json({ message: "Dishes fetched successfully", data: dishes });
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
        res.json({ message: "Dish status updated successfully" });
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
                res.json({ message: "Dishes deleted successfully" });
                break;
            case "active":
                yield dish_model_1.default.updateMany({ _id: { $in: ids } }, { status: "active" });
                res.json({ message: "Dishes activated successfully" });
                break;
            case "inactive":
                yield dish_model_1.default.updateMany({ _id: { $in: ids } }, { status: "inactive" });
                res.json({ message: "Dishes deactivated successfully" });
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
        res.json({ message: "Dish deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deleteDish = deleteDish;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body) {
        req.body.images =
            req.body.image || req.body.images || "";
    }
    req.body.price = parseFloat(req.body.price) || 0;
    req.body.rating = parseFloat(req.body.rating) || 0;
    const newDish = new dish_model_1.default(req.body);
    yield newDish.save();
    res.json({ message: "Dish created successfully", data: newDish });
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body) {
            req.body.images =
                req.body.image || req.body.images || "";
        }
        req.body.price = parseFloat(req.body.price) || 0;
        req.body.rating = parseFloat(req.body.rating) || 0;
        yield dish_model_1.default.updateOne({ _id: req.params.id }, req.body);
        res.json({ message: "Dish updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.edit = edit;
const getDishDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dishId = req.params.id;
        const dish = yield dish_model_1.default.findOne({ _id: dishId });
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
