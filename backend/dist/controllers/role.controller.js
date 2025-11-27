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
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield role_model_1.default.find({ deleted: false });
        return new success_response_1.OK({
            message: "Roles fetched successfully",
            metadata: roles,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error fetching roles").send(res);
    }
});
exports.getRoles = getRoles;
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newRole = new role_model_1.default(req.body);
        yield newRole.save();
        return new success_response_1.Created({
            message: "Role created successfully",
            metadata: newRole,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error creating role").send(res);
    }
});
exports.createRole = createRole;
const editRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield role_model_1.default.updateOne({ _id: id }, req.body);
        const updatedRole = yield role_model_1.default.findById(id);
        return new success_response_1.OK({
            message: "Role updated successfully",
            metadata: updatedRole,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating role").send(res);
    }
});
exports.editRole = editRole;
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield role_model_1.default.updateOne({ _id: id }, { deleted: true });
        return new success_response_1.OK({
            message: "Role deleted successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error deleting role").send(res);
    }
});
exports.deleteRole = deleteRole;
