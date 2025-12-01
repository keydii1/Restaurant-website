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
exports.statusAndOrderTimeConsistency = exports.deletedValid = exports.finishedTimeValid = exports.orderTimeValid = exports.tableNameLength = exports.positionLength = exports.positionRequired = exports.statusValid = exports.maximumCapacityValid = exports.maximumCapacityRequired = exports.tableNumberUnique = exports.tableNumberValid = exports.tableNumberRequired = void 0;
const table_model_1 = __importDefault(require("../models/table.model"));
const tableNumberRequired = (req, res, next) => {
    if (req.body.tableNumber === undefined) {
        return res.status(400).json({ message: "Table number is required" });
    }
    next();
};
exports.tableNumberRequired = tableNumberRequired;
const tableNumberValid = (req, res, next) => {
    const raw = req.body.tableNumber;
    if (raw !== undefined) {
        const tableNumber = Number(raw);
        if (isNaN(tableNumber) ||
            !Number.isInteger(tableNumber) ||
            tableNumber < 1) {
            return res
                .status(400)
                .json({ message: "Table number must be an integer >= 1" });
        }
    }
    next();
};
exports.tableNumberValid = tableNumberValid;
const tableNumberUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tableNumber = req.body.tableNumber;
    if (tableNumber !== undefined) {
        const existingTable = yield table_model_1.default.findOne({
            tableNumber: tableNumber,
            deleted: false,
        });
        if (existingTable &&
            existingTable._id.toString() !== (req.params.id || "")) {
            return res.status(400).json({ message: "Table number already exists" });
        }
    }
    next();
});
exports.tableNumberUnique = tableNumberUnique;
const maximumCapacityRequired = (req, res, next) => {
    if (req.body.maximumCapacity === undefined) {
        return res.status(400).json({ message: "Maximum capacity is required" });
    }
    next();
};
exports.maximumCapacityRequired = maximumCapacityRequired;
const maximumCapacityValid = (req, res, next) => {
    const raw = req.body.maximumCapacity;
    if (raw !== undefined) {
        const maximumCapacity = Number(raw);
        if (isNaN(maximumCapacity) ||
            !Number.isInteger(maximumCapacity) ||
            maximumCapacity < 1) {
            return res
                .status(400)
                .json({ message: "Maximum capacity must be an integer >= 1" });
        }
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
    if (req.body.position === undefined ||
        (typeof req.body.position === "string" && req.body.position.trim() === "")) {
        return res.status(400).json({ message: "Position is required" });
    }
    next();
};
exports.positionRequired = positionRequired;
const positionLength = (req, res, next) => {
    if (req.body.position &&
        typeof req.body.position === "string" &&
        req.body.position.length > 100) {
        return res
            .status(400)
            .json({ message: "Position must not exceed 100 characters" });
    }
    next();
};
exports.positionLength = positionLength;
const tableNameLength = (req, res, next) => {
    if (req.body.tableName &&
        typeof req.body.tableName === "string" &&
        req.body.tableName.length > 100) {
        return res
            .status(400)
            .json({ message: "Table name must not exceed 100 characters" });
    }
    next();
};
exports.tableNameLength = tableNameLength;
const orderTimeValid = (req, res, next) => {
    if (req.body.orderTime !== undefined &&
        req.body.orderTime !== null &&
        req.body.orderTime !== "") {
        const parsed = Date.parse(req.body.orderTime);
        if (isNaN(parsed)) {
            return res
                .status(400)
                .json({ message: "orderTime must be a valid date/time" });
        }
    }
    next();
};
exports.orderTimeValid = orderTimeValid;
const finishedTimeValid = (req, res, next) => {
    if (req.body.finishedTime !== undefined &&
        req.body.finishedTime !== null &&
        req.body.finishedTime !== "") {
        const parsedFinished = Date.parse(req.body.finishedTime);
        if (isNaN(parsedFinished)) {
            return res
                .status(400)
                .json({ message: "finishedTime must be a valid date/time" });
        }
        if (req.body.orderTime !== undefined &&
            req.body.orderTime !== null &&
            req.body.orderTime !== "") {
            const parsedOrder = Date.parse(req.body.orderTime);
            if (!isNaN(parsedOrder) && parsedFinished < parsedOrder) {
                return res.status(400).json({
                    message: "finishedTime must be the same or after orderTime",
                });
            }
        }
    }
    next();
};
exports.finishedTimeValid = finishedTimeValid;
const deletedValid = (req, res, next) => {
    if (req.body.deleted !== undefined) {
        if (typeof req.body.deleted !== "boolean") {
            return res.status(400).json({ message: "deleted must be a boolean" });
        }
    }
    next();
};
exports.deletedValid = deletedValid;
const statusAndOrderTimeConsistency = (req, res, next) => {
    if (req.body.status === "occupied") {
        if (req.body.orderTime === undefined ||
            req.body.orderTime === null ||
            req.body.orderTime === "") {
            return res
                .status(400)
                .json({ message: "orderTime is required when status is 'occupied'" });
        }
    }
    next();
};
exports.statusAndOrderTimeConsistency = statusAndOrderTimeConsistency;
