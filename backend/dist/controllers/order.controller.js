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
exports.updatePaymentStatus = exports.updateOrderStatus = exports.updateOrder = exports.createOrder = exports.GetOrderDetail = exports.getOrders = exports.getAllOrders = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find()
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
        return new success_response_1.OK({
            message: "Fetch all orders successfully",
            metadata: orders,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error fetching orders").send(res);
    }
});
exports.getAllOrders = getAllOrders;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.accessToken.id;
        const orders = yield order_model_1.default.find({ userId: userId })
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
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
const GetOrderDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield order_model_1.default.findById(id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
        if (!order) {
            return new error_response_1.BadRequestError("Order not found").send(res);
        }
        return new success_response_1.OK({
            message: "Fetch order successfully",
            metadata: order,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error fetching order").send(res);
    }
});
exports.GetOrderDetail = GetOrderDetail;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.accessToken.id;
        const newOrder = new order_model_1.default(Object.assign(Object.assign({}, req.body), { userId: userId }));
        yield newOrder.save();
        const populatedOrder = yield order_model_1.default.findById(newOrder._id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
        return new success_response_1.Created({
            message: "Order created successfully",
            metadata: populatedOrder,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error creating order").send(res);
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield order_model_1.default.updateOne({ _id: id }, { $set: req.body });
        const updatedOrder = yield order_model_1.default.findById(id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
        return new success_response_1.OK({
            message: "Order updated successfully",
            metadata: updatedOrder,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating order").send(res);
    }
});
exports.updateOrder = updateOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        yield order_model_1.default.updateOne({ _id: id }, { status: status });
        const updatedOrder = yield order_model_1.default.findById(id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
        return new success_response_1.OK({
            message: "Order status updated successfully",
            metadata: updatedOrder,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating order status").send(res);
    }
});
exports.updateOrderStatus = updateOrderStatus;
const updatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { payed } = req.body;
        yield order_model_1.default.updateOne({ _id: id }, { payed: payed });
        const updatedOrder = yield order_model_1.default.findById(id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status");
        return new success_response_1.OK({
            message: "Payment status updated successfully",
            metadata: updatedOrder,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating payment status").send(res);
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
