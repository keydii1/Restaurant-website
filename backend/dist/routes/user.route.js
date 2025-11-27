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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("../controllers/user.controller"));
const userValidate = __importStar(require("../validates/user.validate"));
const router = (0, express_1.Router)();
const EmailAndPassword_validate_1 = require("../validates/EmailAndPassword.validate");
const checkAuth_auth_1 = require("../auth/checkAuth.auth");
router.get("/", checkAuth_auth_1.authAdmin, controller.getUsers);
router.post("/register", userValidate.usernameNotEmpty, EmailAndPassword_validate_1.validateEmail, userValidate.emailValid, userValidate.emailExistCheck, EmailAndPassword_validate_1.validatePassword, userValidate.passwordRequirements, controller.register);
router.post("/login", EmailAndPassword_validate_1.validateEmail, userValidate.emailValid, controller.login);
router.post("/forgot-password", EmailAndPassword_validate_1.validateEmail, userValidate.emailValid, controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.patch("/reset-password", EmailAndPassword_validate_1.validatePassword, userValidate.passwordRequirements, controller.resetPassword);
router.get("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.get("/auth/google", controller.googleAuth);
router.get("/auth/google/callback", controller.googleAuthCallback);
exports.default = router;
