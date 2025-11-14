"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.statusValid = exports.tittleNotMoreThan30Chars = exports.titleNotEmpty = void 0;
const titleNotEmpty = (req, res, next) => {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }
    next();
};
exports.titleNotEmpty = titleNotEmpty;
const tittleNotMoreThan30Chars = (req, res, next) => {
    if (req.body.title && req.body.title.length > 30) {
        return res
            .status(400)
            .json({ message: "Title must not exceed 30 characters" });
    }
    next();
};
exports.tittleNotMoreThan30Chars = tittleNotMoreThan30Chars;
const statusValid = (req, res, next) => {
    const validStatuses = ["active", "inactive"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
        return res
            .status(400)
            .json({ message: "Status must be either active or inactive" });
    }
    next();
};
exports.statusValid = statusValid;
const test = (req, res, next) => {
    console.log("Test middleware executed");
    next();
};
exports.test = test;
