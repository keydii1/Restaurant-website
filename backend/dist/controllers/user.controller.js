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
exports.googleAuthCallback = exports.googleAuth = exports.refreshToken = exports.logout = exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.login = exports.editProfile = exports.getProfile = exports.register = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const otp_model_1 = __importDefault(require("../models/otp.model"));
const GenerateHelper = __importStar(require("../helpers/generate.helper"));
const sendMailForgotPasswords_1 = __importDefault(require("../utils/SendMail/sendMailForgotPasswords"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const googleapis_1 = require("googleapis");
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const tokenServices_1 = require("../utils/auth/tokenServices");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        return new success_response_1.OK({
            message: "Success",
            metadata: users,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getUsers = getUsers;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.password = yield bcrypt_1.default.hash(req.body.password, 10);
        const newUser = new user_model_1.default(req.body);
        yield newUser.save();
        yield (0, tokenServices_1.createApiKey)(newUser._id.toString());
        return new success_response_1.OK({
            message: "User registered successfully",
            metadata: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.register = register;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        const user = yield user_model_1.default.findById(userId).select("username email phone avatar dateOfBirth address");
        if (!user) {
            return new error_response_1.BadRequestError("User not found").send(res);
        }
        return new success_response_1.OK({
            message: "Profile fetched successfully",
            metadata: user,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.getProfile = getProfile;
const editProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.accessToken;
        const userId = accesstoken.id;
        yield user_model_1.default.updateOne({ _id: userId }, { $set: req.body });
        const updatedUser = yield user_model_1.default.findById(userId).select("username email phone avatar dateOfBirth address");
        return new success_response_1.OK({
            message: "Profile updated successfully",
            metadata: updatedUser,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.editProfile = editProfile;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email: email });
        if (!user) {
            return new error_response_1.BadRequestError("Email does not exist").send(res);
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            return new error_response_1.BadRequestError("Password is incorrect").send(res);
        }
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        const accessToken = yield (0, tokenServices_1.createAccessToken)(payload);
        const refreshToken = yield (0, tokenServices_1.createRefreshToken)(payload);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return new success_response_1.OK({
            message: "Login successful",
            metadata: {
                accessToken: accessToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                },
            },
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return new error_response_1.BadRequestError("User with this email does not exist").send(res);
        }
        const otpCode = GenerateHelper.generateOTP();
        const otpEntry = new otp_model_1.default({
            userId: user._id,
            code: otpCode,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });
        yield otpEntry.save();
        yield (0, sendMailForgotPasswords_1.default)(email, otpCode);
        return new success_response_1.OK({
            message: "OTP sent to email successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.forgotPassword = forgotPassword;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return new error_response_1.BadRequestError("User with this email does not exist").send(res);
        }
        const otpEntry = yield otp_model_1.default.findOne({ userId: user._id, code: otp });
        if (!otpEntry) {
            return new error_response_1.BadRequestError("Invalid OTP").send(res);
        }
        if (otpEntry.expiresAt < new Date()) {
            yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
            return new error_response_1.BadRequestError("OTP has expired").send(res);
        }
        yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
        return new success_response_1.OK({
            message: "OTP verified successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.verifyOtp = verifyOtp;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return new error_response_1.BadRequestError("User with this email does not exist").send(res);
        }
        const otpEntry = yield otp_model_1.default.findOne({ userId: user._id, code: otp });
        if (!otpEntry) {
            return new error_response_1.BadRequestError("Invalid OTP").send(res);
        }
        if (otpEntry.expiresAt < new Date()) {
            yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
            return new error_response_1.BadRequestError("OTP has expired").send(res);
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        yield otp_model_1.default.deleteOne({ _id: otpEntry._id });
        return new success_response_1.OK({
            message: "Password reset successfully",
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError().send(res);
    }
});
exports.resetPassword = resetPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return new success_response_1.OK({
            message: "Logout successful",
            metadata: null,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Internal server error").send(res);
    }
});
exports.logout = logout;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAccessToken = yield (0, tokenServices_1.refreshAccessToken)(req);
        return new success_response_1.OK({
            message: "Access token refreshed successfully",
            metadata: { accessToken: newAccessToken },
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError(error.message || "Internal server error").send(res);
    }
});
exports.refreshToken = refreshToken;
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        const SCOPES = ["profile", "email"];
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: SCOPES,
        });
        console.log("Redirecting to Google OAuth2 consent screen:", authUrl);
        res.redirect(authUrl);
    }
    catch (error) {
        return new error_response_1.BadRequestError(error.message || "Internal server error").send(res);
    }
});
exports.googleAuth = googleAuth;
const googleAuthCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const code = req.query.code;
        if (!code) {
            console.log("No code provided");
            return res.redirect("/");
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        try {
            const { tokens } = yield oauth2Client.getToken(code);
            oauth2Client.setCredentials(tokens);
            console.log(tokens.access_token);
            console.log(tokens.refresh_token);
            console.log(tokens.expiry_date);
            const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
            const userinfo = yield oauth2.userinfo.get();
            const user = yield user_model_1.default.findOne({
                googleId: userinfo.data.id,
            });
            if (user) {
                return new error_response_1.BadRequestError("User already exists").send(res);
            }
            if (!user) {
                const newUser = new user_model_1.default({
                    username: userinfo.data.name,
                    email: userinfo.data.email,
                    password: "",
                    googleId: userinfo.data.id,
                    loginMethod: "google",
                    isAdmin: false,
                    avatar: userinfo.data.picture || "",
                    refreshToken: tokens.refresh_token,
                });
                yield newUser.save();
                console.log("New user created:", newUser.email);
            }
            else {
                console.log("Existing user logged in:", user.email);
            }
            console.log("User logged in:", userinfo.data.email);
            return res.redirect("/profile");
        }
        catch (err) {
            return res.status(500).send("Authentication error");
        }
    }
    catch (error) {
        return new error_response_1.BadRequestError(error.message || "Internal server error").send(res);
    }
});
exports.googleAuthCallback = googleAuthCallback;
