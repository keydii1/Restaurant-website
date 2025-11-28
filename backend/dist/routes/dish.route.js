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
const router = (0, express_1.Router)();
const uploadCloud_middleware_1 = require("../middlewares/uploadCloud.middleware");
const checkAuth_auth_1 = require("../auth/checkAuth.auth");
const controller = __importStar(require("../controllers/dish.controller"));
const dishValidate = __importStar(require("../validates/dish.validate"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({
    dest: "uploads/",
    limits: {
        fileSize: 50 * 1024 * 1024,
        fieldSize: 50 * 1024 * 1024,
    },
});
router.get("/", controller.getDishes);
router.patch("/change-status/:id/:status", checkAuth_auth_1.authAdmin, controller.changeStatus);
router.patch("/change-multi", checkAuth_auth_1.authAdmin, controller.changeMulti);
router.delete("/delete/:id", checkAuth_auth_1.authAdmin, controller.deleteDish);
router.post("/create", checkAuth_auth_1.authAdmin, upload.single("image"), uploadCloud_middleware_1.uploadImage, dishValidate.nameNotEmpty, dishValidate.nameNotMoreThan100Chars, dishValidate.categoryExistCheck, dishValidate.priceValid, dishValidate.discountValid, dishValidate.ratingValid, dishValidate.prepareTimeValid, dishValidate.descriptionValid, controller.create);
router.get("/create", (req, res) => {
    res.render("product/upload_test.pug");
});
router.patch("/edit/:id", checkAuth_auth_1.authAdmin, upload.single("image"), uploadCloud_middleware_1.uploadImage, dishValidate.nameNotMoreThan100Chars, dishValidate.priceValid, dishValidate.discountValid, dishValidate.ratingValid, dishValidate.prepareTimeValid, dishValidate.descriptionValid, controller.edit);
router.get("/detail/:id", checkAuth_auth_1.auth, controller.getDishDetail);
exports.default = router;
