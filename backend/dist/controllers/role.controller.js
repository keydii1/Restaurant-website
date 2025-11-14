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
exports.deleteRole = exports.editRole = exports.createRole = exports.getRoles = void 0;
const role_model_1 = __importDefault(require("../models/role.model"));
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield role_model_1.default.find();
        res.status(200).json(roles);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching roles" });
    }
});
exports.getRoles = getRoles;
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRole = new role_model_1.default(req.body);
        yield newRole.save();
        res.status(201).json(newRole);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating role" });
    }
});
exports.createRole = createRole;
const editRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield role_model_1.default.updateOne({ _id: id }, req.body);
        res.json({ message: "Role updated successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.editRole = editRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield role_model_1.default.updateOne({ _id: id }, { deleted: true });
        res.json({ message: "Role deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});
exports.deleteRole = deleteRole;
