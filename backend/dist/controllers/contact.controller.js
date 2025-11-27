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
exports.deleteResolvedContacts = exports.deleteContact = exports.edit = exports.create = exports.getContacts = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find({ deleted: false });
        return new success_response_1.OK({
            message: "Contacts fetched successfully",
            metadata: contacts,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getContacts = getContacts;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newContact = new contact_model_1.default(req.body);
        yield newContact.save();
        return new success_response_1.OK({
            message: "Contact created successfully",
            metadata: newContact,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.create = create;
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield contact_model_1.default.updateOne({ _id: id }, req.body);
        return new success_response_1.OK({
            message: "Contact updated successfully",
            metadata: yield contact_model_1.default.findOne({ _id: id }),
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.edit = edit;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield contact_model_1.default.updateOne({ _id: id }, { deleted: true });
        return new success_response_1.OK({
            message: "Contact deleted successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.deleteContact = deleteContact;
const deleteResolvedContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resolvedContacts = yield contact_model_1.default.find({
            status: "Resolved",
            deleted: false,
        });
        const ids = resolvedContacts.map((contact) => contact._id);
        yield contact_model_1.default.updateMany({ _id: { $in: ids } }, { deleted: true });
        return new success_response_1.OK({
            message: "Resolved contacts deleted successfully",
            metadata: { count: ids.length },
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.deleteResolvedContacts = deleteResolvedContacts;
