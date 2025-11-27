"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdRequired = exports.amountValid = exports.amountRequired = void 0;
const amountRequired = (req, res, next) => {
    if (!req.body.amount && req.body.amount !== 0) {
        return res.status(400).json({ message: "Amount is required" });
    }
    next();
};
exports.amountRequired = amountRequired;
const amountValid = (req, res, next) => {
    const amount = req.body.amount;
    if (amount !== undefined && (isNaN(amount) || amount < 0)) {
        return res
            .status(400)
            .json({ message: "Amount must be a positive number" });
    }
    next();
};
exports.amountValid = amountValid;
const orderIdRequired = (req, res, next) => {
    if (!req.body.orderId || req.body.orderId.trim() === "") {
        return res.status(400).json({ message: "Order ID is required" });
    }
    next();
};
exports.orderIdRequired = orderIdRequired;
