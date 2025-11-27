"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentLength = exports.contentRequired = exports.titleLength = exports.titleRequired = void 0;
const titleRequired = (req, res, next) => {
    if (!req.body.title || req.body.title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }
    next();
};
exports.titleRequired = titleRequired;
const titleLength = (req, res, next) => {
    if (req.body.title && req.body.title.length > 100) {
        return res
            .status(400)
            .json({ message: "Title must not exceed 100 characters" });
    }
    next();
};
exports.titleLength = titleLength;
const contentRequired = (req, res, next) => {
    if (!req.body.content || req.body.content.trim() === "") {
        return res.status(400).json({ message: "Content is required" });
    }
    next();
};
exports.contentRequired = contentRequired;
const contentLength = (req, res, next) => {
    if (req.body.content && req.body.content.length < 10) {
        return res
            .status(400)
            .json({ message: "Content must be at least 10 characters long" });
    }
    next();
};
exports.contentLength = contentLength;
