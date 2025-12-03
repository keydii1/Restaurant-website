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
exports.successfulPayment = exports.createPayment = exports.updatePaymentStatus = exports.updateOrderStatus = exports.updateOrder = exports.createOrder = exports.GetOrderDetail = exports.getOrders = exports.getAllOrders = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const success_response_1 = require("../core/success.response");
const error_response_1 = require("../core/error.response");
const sendMailThankyou_1 = __importDefault(require("../utils/SendMail/sendMailThankyou"));
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find()
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status")
            .populate("cartId");
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
            .populate("tableId", "tableNumber status")
            .populate("cartId");
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
            .populate("tableId", "tableNumber status")
            .populate("cartId");
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
        const newOrder = new order_model_1.default(req.body);
        newOrder.userId = userId;
        yield newOrder.save();
        const populatedOrder = yield order_model_1.default.findById(newOrder._id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status")
            .populate("cartId");
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
            .populate("tableId", "tableNumber status")
            .populate("cartId");
        if (!updatedOrder) {
            return new error_response_1.BadRequestError("Order not found").send(res);
        }
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
        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return new error_response_1.BadRequestError("Invalid status value").send(res);
        }
        yield order_model_1.default.updateOne({ _id: id }, { status: status });
        const updatedOrder = yield order_model_1.default.findById(id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status")
            .populate("cartId");
        if (!updatedOrder) {
            return new error_response_1.BadRequestError("Order not found").send(res);
        }
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
        const { typeOfPayment } = req.body;
        const validPayments = ["cash", "card", "momo"];
        if (typeOfPayment && !validPayments.includes(typeOfPayment)) {
            return new error_response_1.BadRequestError("Invalid payment type").send(res);
        }
        yield order_model_1.default.updateOne({ _id: id }, { $set: { typeOfPayment } });
        const updatedOrder = yield order_model_1.default.findById(id)
            .populate("userId", "username email")
            .populate("tableId", "tableNumber status")
            .populate("cartId");
        if (!updatedOrder) {
            return new error_response_1.BadRequestError("Order not found").send(res);
        }
        return new success_response_1.OK({
            message: "Payment updated successfully",
            metadata: updatedOrder,
        }).send(res);
    }
    catch (error) {
        return new error_response_1.BadRequestError("Error updating payment status").send(res);
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idOfOrder = req.body.id;
        const email = req.body.email;
        const InforOfOrder = yield order_model_1.default.findById(idOfOrder);
        if (!InforOfOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        var accessKey = "F8BBA842ECF85";
        var secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        var orderInfo = InforOfOrder._id.toString();
        var partnerCode = "MOMO";
        var redirectUrl = "http://localhost:3000/restaurant/api/v1/orders/result?id=" +
            InforOfOrder._id.toString() +
            "&&email=" +
            email.toString();
        var ipnUrl = "http://localhost:3000/restaurant/api/v1/orders/result?id=" +
            InforOfOrder._id.toString() +
            "&&email=" +
            email.toString();
        var requestType = "payWithMethod";
        var amount = InforOfOrder.totalPrice.toString();
        var orderId = partnerCode + new Date().getTime();
        var requestId = orderId;
        var extraData = "";
        var paymentCode = "T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==";
        var orderGroupId = "";
        var autoCapture = true;
        var lang = "vi";
        var rawSignature = "accessKey=" +
            accessKey +
            "&amount=" +
            amount +
            "&extraData=" +
            extraData +
            "&ipnUrl=" +
            ipnUrl +
            "&orderId=" +
            orderId +
            "&orderInfo=" +
            orderInfo +
            "&partnerCode=" +
            partnerCode +
            "&redirectUrl=" +
            redirectUrl +
            "&requestId=" +
            requestId +
            "&requestType=" +
            requestType;
        console.log("--------------------RAW SIGNATURE----------------");
        console.log(rawSignature);
        const crypto = require("crypto");
        var signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");
        console.log("--------------------SIGNATURE----------------");
        console.log(signature);
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Test",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature,
        });
        const https = require("https");
        const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/create",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody),
            },
        };
        const req2 = https.request(options, (res2) => {
            console.log(`Status: ${res2.statusCode}`);
            console.log(`Headers: ${JSON.stringify(res2.headers)}`);
            res2.setEncoding("utf8");
            res2.on("data", (body) => {
                const responseBody = JSON.parse(body);
                res.status(200).json({
                    message: "Create MoMo payment successfully",
                    data: responseBody,
                });
            });
            res2.on("end", () => {
                console.log("No more data in response.");
            });
        });
        req2.on("error", (e) => {
            console.log(`problem with request: ${e.message}`);
        });
        console.log("Sending....");
        req2.write(requestBody);
        req2.end();
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createPayment = createPayment;
const successfulPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idOfOrder = req.query.id;
        const email = req.query.email;
        const InforOfOrder = yield order_model_1.default.findById(idOfOrder);
        if (!InforOfOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        yield order_model_1.default.updateOne({
            _id: idOfOrder,
        }, {
            status: "confirmed",
        });
        yield (0, sendMailThankyou_1.default)(email.toString());
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.successfulPayment = successfulPayment;
