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
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const success_response_2 = require("../core/success.response");
const getAllTables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tables = yield table_model_1.default.find({ deleted: false });
        return new success_response_2.OK({
            message: "Fetched all tables successfully",
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
        yield newTable.save();
        return new success_response_1.Created({
            message: "Table created successfully",
            metadata: newTable,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.createTable = createTable;
const deleteTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tableId = req.params.id;
        yield table_model_1.default.updateOne({ _id: tableId }, { deleted: true });
        return new success_response_2.OK({
            message: "Table deleted successfully",
        }).send(res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.deleteTable = deleteTable;
const editTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tableId = req.params.id;
        const updatedData = req.body;
        const table = yield table_model_1.default.findOne({ _id: tableId, deleted: false });
        const allTable = yield table_model_1.default.find({ deleted: false });
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }
        for (const t of allTable) {
            if (t.tableNumber === updatedData.tableNumber)
                return new error_response_1.BadRequestError("Table number already exists").send(res);
            if (t.position === updatedData.position) {
                return new error_response_1.BadRequestError("Table position already exists").send(res);
            }
        }
        yield table_model_1.default.updateOne({ _id: tableId }, updatedData);
        return new success_response_2.OK({
            message: "Table updated successfully",
            metadata: yield table_model_1.default.findById(tableId),
        }).send(res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.editTable = editTable;
const changeTableStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tableId = req.params.id;
        const status = req.body.status;
        const table = yield table_model_1.default.findOne({ _id: tableId, deleted: false });
        if (!table) {
            return new error_response_1.BadRequestError("Table not found").send(res);
        }
        yield table_model_1.default.updateOne({ _id: tableId }, { status: status });
        return new success_response_2.OK({
            message: "Table status updated successfully",
            metadata: yield table_model_1.default.findById(tableId),
        }).send(res);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
exports.changeTableStatus = changeTableStatus;
