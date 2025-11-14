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
exports.changeTableStatus = exports.editTable = exports.deleteTable = exports.createTable = exports.getAllTables = void 0;
const table_model_1 = __importDefault(require("../models/table.model"));
const success_response_1 = require("../../core/success.response");
const error_response_1 = require("../../core/error.response");
const success_response_2 = require("../../core/success.response");
const statusCodes = require("../../core/statusCodes");
const reasonPhrases = require("../../core/reasonPhrases");
const getAllTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield table_model_1.default.find({
            deleted: false,
        });
        return new success_response_2.OK({
            message: "Tables fetched successfully",
            metadata: tables,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getAllTables = getAllTables;
const createTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTable = new table_model_1.default(req.body);
        const savedTable = yield newTable.save();
        return new success_response_1.Created({
            message: "Table created successfully",
            metadata: savedTable,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.createTable = createTable;
const deleteTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTable = yield table_model_1.default.findOne({ _id: id });
        if (!deletedTable) {
            return new error_response_1.BadRequestError(reasonPhrases.NOT_FOUND, statusCodes.NOT_FOUND, reasonPhrases.NOT_FOUND).send(res);
        }
        yield table_model_1.default.updateOne({ _id: id }, { $set: { deleted: true } });
        return new success_response_2.OK({
            message: "Table deleted successfully",
            metadata: deletedTable,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.deleteTable = deleteTable;
const editTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedTable = yield table_model_1.default.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        if (!updatedTable) {
            return new error_response_1.BadRequestError(reasonPhrases.NOT_FOUND, statusCodes.NOT_FOUND, reasonPhrases.NOT_FOUND).send(res);
        }
        return new success_response_2.OK({
            message: "Table updated successfully",
            metadata: updatedTable,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.editTable = editTable;
const changeTableStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, status } = req.params;
        const validStatuses = ["available", "occupied", "reserved"];
        if (!validStatuses.includes(status)) {
            return new error_response_1.BadRequestError("Invalid status value. Valid values: " + validStatuses.join(", "), statusCodes.BAD_REQUEST, reasonPhrases.BAD_REQUEST).send(res);
        }
        const updatedTable = yield table_model_1.default.findByIdAndUpdate(id, { $set: { status: status } }, { new: true });
        if (!updatedTable) {
            return new error_response_1.BadRequestError(reasonPhrases.NOT_FOUND, statusCodes.NOT_FOUND, reasonPhrases.NOT_FOUND).send(res);
        }
        return new success_response_2.OK({
            message: "Table status updated successfully",
            metadata: updatedTable,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.changeTableStatus = changeTableStatus;
