"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusValid = exports.descriptionLength = exports.nameLength = exports.nameRequired = void 0;
const nameRequired = (req, res, next) => {
    if (!req.body.name || req.body.name.trim() === "") {
        return res.status(400).json({ message: "Category name is required" });
    }
    next();
};
exports.nameRequired = nameRequired;
const nameLength = (req, res, next) => {
    if (req.body.name && req.body.name.length > 100) {
        return res
            .status(400)
            .json({ message: "Category name must not exceed 100 characters" });
    }
    next();
};
exports.nameLength = nameLength;
const descriptionLength = (req, res, next) => {
    if (req.body.description && req.body.description.length > 500) {
        return res
            .status(400)
            .json({ message: "Description must not exceed 500 characters" });
    }
    next();
};
exports.descriptionLength = descriptionLength;
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
