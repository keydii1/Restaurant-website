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
exports.uploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.API_KEY || process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.API_SECRET || process.env.CLOUDINARY_API_SECRET,
});
const uploadImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            console.log("No file provided in request");
            return next();
        }
        console.log("File received:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path,
        });
        if (!fs_1.default.existsSync(file.path)) {
            return res.status(400).json({
                message: "File not found on server",
                error: "Uploaded file path does not exist",
            });
        }
        const result = yield cloudinary_1.v2.uploader.upload(file.path, {
            folder: "dishes_images",
            resource_type: "auto",
        });
        console.log("Cloudinary uploaded successfully:", result.secure_url);
        try {
            fs_1.default.unlinkSync(file.path);
        }
        catch (e) {
            console.warn("Could not remove temp file:", file.path, e);
        }
        req.body.image = result.secure_url;
        return next();
    }
    catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            message: "Upload failed",
            error: error.message || error,
            details: error.error || null,
        });
    }
});
exports.uploadImage = uploadImage;
