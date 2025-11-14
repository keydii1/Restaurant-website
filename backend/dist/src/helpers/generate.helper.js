"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = exports.generateRandomNumber = exports.generateRandomString = void 0;
const generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
const generateRandomNumber = (length) => {
    const characters = "0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateRandomNumber = generateRandomNumber;
const generateOTP = () => {
    const length = 6;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp.padStart(length, "0");
};
exports.generateOTP = generateOTP;
