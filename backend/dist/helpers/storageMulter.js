"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = (req, res) => {
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "./public/uploads/");
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now();
            cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
    });
    return storage;
};
exports.storage = storage;
