"use strict";
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
exports.getOrders = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.accessToken.id;
        const orders = yield order_model_1.default.findOne({ userId: userId });
        return new success_response_1.OK({
            message: "Fetch orders successfully",
            metadata: orders,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error fetching orders").send(res);
    }
});
exports.getOrders = getOrders;
