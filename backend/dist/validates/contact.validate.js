"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailValid = exports.statusValid = exports.messageLength = exports.messageRequired = exports.nameLength = exports.nameRequired = void 0;
const nameRequired = (req, res, next) => {
    if (!req.body.name || req.body.name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }
    next();
};
exports.nameRequired = nameRequired;
const nameLength = (req, res, next) => {
    if (req.body.name && req.body.name.length > 100) {
        return res
            .status(400)
            .json({ message: "Name must not exceed 100 characters" });
    }
    next();
};
exports.nameLength = nameLength;
const messageRequired = (req, res, next) => {
    if (!req.body.message || req.body.message.trim() === "") {
        return res.status(400).json({ message: "Message is required" });
    }
    next();
};
exports.messageRequired = messageRequired;
const messageLength = (req, res, next) => {
    if (req.body.message && req.body.message.length < 10) {
        return res
            .status(400)
            .json({ message: "Message must be at least 10 characters long" });
    }
    if (req.body.message && req.body.message.length > 1000) {
        return res
            .status(400)
            .json({ message: "Message must not exceed 1000 characters" });
    }
    next();
};
exports.messageLength = messageLength;
const statusValid = (req, res, next) => {
    const validStatuses = ["Pending", "Reviewed", "Resolved"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
        return res.status(400).json({
            message: "Status must be either Pending, Reviewed, or Resolved",
        });
    }
    next();
};
exports.statusValid = statusValid;
const emailValid = (req, res, next) => {
    const email = req.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format, please enter a email that have to match the format:  example@example.com",
        });
    }
    next();
};
exports.emailValid = emailValid;
