"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadCloud_middleware_1 = require("../middlewares/uploadCloud.middleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ dest: "uploads/" });
const controller = __importStar(require("../controllers/blog.controller"));
const checkAuth_auth_1 = require("../auth/checkAuth.auth");
const blogValidate = __importStar(require("../validates/blog.validate"));
const router = (0, express_1.Router)();
router.get("/", controller.getBlogs);
router.post("/create", checkAuth_auth_1.authAdmin, upload.single("image"), uploadCloud_middleware_1.uploadImage, blogValidate.titleRequired, blogValidate.titleLength, blogValidate.contentRequired, blogValidate.contentLength, controller.create);
router.patch("/edit/:id", checkAuth_auth_1.authAdmin, upload.single("image"), uploadCloud_middleware_1.uploadImage, blogValidate.titleRequired, blogValidate.titleLength, blogValidate.contentRequired, blogValidate.contentLength, controller.edit);
router.get("/detail/:id", controller.getBlogDetail);
router.delete("/delete/:id", checkAuth_auth_1.authAdmin, controller.DeleteBlog);
exports.default = router;
