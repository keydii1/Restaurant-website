"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOfPaymentValid = exports.totalPriceValid = exports.statusValid = void 0;
const statusValid = (req, res, next) => {
    const validStatuses = ["pending", "confirmed", "preparing", "completed", "cancelled"];
    if (req.body.status && !validStatuses.includes(req.body.status)) {
        return res.status(400).json({
            message: "Status must be one of: pending, confirmed, preparing, completed, cancelled",
        });
    }
    next();
};
exports.statusValid = statusValid;
const totalPriceValid = (req, res, next) => {
    const totalPrice = req.body.totalPrice;
    if (totalPrice !== undefined && (isNaN(totalPrice) || totalPrice < 0)) {
        return res
            .status(400)
            .json({ message: "Total price must be a positive number" });
    }
    next();
};
exports.totalPriceValid = totalPriceValid;
const typeOfPaymentValid = (req, res, next) => {
    const validTypes = ["cash", "card", "online", "momo", "zalopay"];
    if (req.body.typeOfPayment && !validTypes.includes(req.body.typeOfPayment)) {
        return res.status(400).json({
            message: "Type of payment must be one of: cash, card, online, momo, zalopay",
        });
    }
    next();
};
exports.typeOfPaymentValid = typeOfPaymentValid;
