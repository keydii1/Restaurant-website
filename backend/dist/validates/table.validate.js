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
exports.positionLength = exports.positionRequired = exports.statusValid = exports.maximumCapacityValid = exports.maximumCapacityRequired = exports.tableNumberUnique = exports.tableNumberValid = exports.tableNumberRequired = void 0;
const table_model_1 = __importDefault(require("../models/table.model"));
const tableNumberRequired = (req, res, next) => {
    if (!req.body.tableNumber && req.body.tableNumber !== 0) {
        return res.status(400).json({ message: "Table number is required" });
    }
    next();
};
exports.tableNumberRequired = tableNumberRequired;
const tableNumberValid = (req, res, next) => {
    const tableNumber = req.body.tableNumber;
    if (tableNumber !== undefined && (isNaN(tableNumber) || tableNumber < 1)) {
        return res
            .status(400)
            .json({ message: "Table number must be a positive number" });
    }
    next();
};
exports.tableNumberValid = tableNumberValid;
const tableNumberUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tableNumber = req.body.tableNumber;
    if (tableNumber !== undefined) {
        const existingTable = yield table_model_1.default.findOne({ tableNumber: tableNumber });
        if (existingTable && existingTable._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Table number already exists" });
        }
    }
    next();
});
exports.tableNumberUnique = tableNumberUnique;
const maximumCapacityRequired = (req, res, next) => {
    if (!req.body.maximumCapacity && req.body.maximumCapacity !== 0) {
        return res.status(400).json({ message: "Maximum capacity is required" });
    }
    next();
};
exports.maximumCapacityRequired = maximumCapacityRequired;
const maximumCapacityValid = (req, res, next) => {
    const maximumCapacity = req.body.maximumCapacity;
    if (maximumCapacity !== undefined &&
        (isNaN(maximumCapacity) || maximumCapacity < 1)) {
        return res
            .status(400)
            .json({ message: "Maximum capacity must be a positive number" });
    }
    next();
};
exports.maximumCapacityValid = maximumCapacityValid;
const statusValid = (req, res, next) => {
    const validStatuses = ["available", "occupied", "reserved"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
        return res.status(400).json({
            message: "Status must be one of: available, occupied, reserved",
        });
    }
    next();
};
exports.statusValid = statusValid;
const positionRequired = (req, res, next) => {
    if (!req.body.position || req.body.position.trim() === "") {
        return res.status(400).json({ message: "Position is required" });
    }
    next();
};
exports.positionRequired = positionRequired;
const positionLength = (req, res, next) => {
    if (req.body.position && req.body.position.length > 100) {
        return res
            .status(400)
            .json({ message: "Position must not exceed 100 characters" });
    }
    next();
};
exports.positionLength = positionLength;
