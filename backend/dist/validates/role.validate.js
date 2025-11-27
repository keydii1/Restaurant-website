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
exports.permissionsValid = exports.descriptionLength = exports.nameUnique = exports.nameLength = exports.nameRequired = void 0;
const role_model_1 = __importDefault(require("../models/role.model"));
const nameRequired = (req, res, next) => {
    if (!req.body.name || req.body.name.trim() === "") {
        return res.status(400).json({ message: "Role name is required" });
    }
    next();
};
exports.nameRequired = nameRequired;
const nameLength = (req, res, next) => {
    if (req.body.name && req.body.name.length > 50) {
        return res
            .status(400)
            .json({ message: "Role name must not exceed 50 characters" });
    }
    next();
};
exports.nameLength = nameLength;
const nameUnique = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    if (name) {
        const existingRole = yield role_model_1.default.findOne({ name: name });
        if (existingRole && existingRole._id.toString() !== req.params.id) {
            return res.status(400).json({ message: "Role name already exists" });
        }
    }
    next();
});
exports.nameUnique = nameUnique;
const descriptionLength = (req, res, next) => {
    if (req.body.description && req.body.description.length > 500) {
        return res
            .status(400)
            .json({ message: "Description must not exceed 500 characters" });
    }
    next();
};
exports.descriptionLength = descriptionLength;
const permissionsValid = (req, res, next) => {
    if (req.body.permissions && !Array.isArray(req.body.permissions)) {
        return res
            .status(400)
            .json({ message: "Permissions must be an array of strings" });
    }
    next();
};
exports.permissionsValid = permissionsValid;
