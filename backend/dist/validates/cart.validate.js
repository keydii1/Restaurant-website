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
exports.quantityValid = exports.quantityRequired = exports.dishExists = exports.dishIdRequired = void 0;
const dish_model_1 = __importDefault(require("../models/dish.model"));
const dishIdRequired = (req, res, next) => {
    if (!req.body.dishId) {
        return res.status(400).json({ message: "Dish ID is required" });
    }
    next();
};
exports.dishIdRequired = dishIdRequired;
const dishExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const dishId = req.body.dishId;
    if (dishId) {
        try {
            const dish = yield dish_model_1.default.findById(dishId);
            if (!dish) {
                return res.status(404).json({ message: "Dish not found" });
            }
        }
        catch (error) {
            return res.status(400).json({ message: "Invalid dish ID format" });
        }
    }
    next();
});
exports.dishExists = dishExists;
const quantityRequired = (req, res, next) => {
    if (!req.body.quantity) {
        return res.status(400).json({ message: "Quantity is required" });
    }
    next();
};
exports.quantityRequired = quantityRequired;
const quantityValid = (req, res, next) => {
    const quantity = req.body.quantity;
    if (quantity && (isNaN(quantity) || quantity < 1)) {
        return res
            .status(400)
            .json({ message: "Quantity must be a positive number" });
    }
    next();
};
exports.quantityValid = quantityValid;
