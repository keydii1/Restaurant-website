"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        this.io = null;
        this.adminSockets = new Set();
    }
    initialize(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.io.on("connection", (socket) => {
            console.log(`🔌 Client connected: ${socket.id}`);
            socket.on("admin:join", () => {
                socket.join("admin-room");
                this.adminSockets.add(socket.id);
                console.log(`👤 Admin joined: ${socket.id}`);
            });
            socket.on("admin:leave", () => {
                socket.leave("admin-room");
                this.adminSockets.delete(socket.id);
                console.log(`👤 Admin left: ${socket.id}`);
            });
            socket.on("disconnect", () => {
                this.adminSockets.delete(socket.id);
                console.log(`❌ Client disconnected: ${socket.id}`);
            });
        });
        console.log("🚀 Socket.IO server initialized");
        return this.io;
    }
    getIO() {
        return this.io;
    }
    notifyNewOrder(orderData) {
        if (this.io) {
            this.io.to("admin-room").emit("order:new", {
                type: "NEW_ORDER",
                message: "Có đơn hàng mới!",
                data: orderData,
                timestamp: new Date().toISOString(),
            });
            console.log("📢 Sent new order notification to admin");
        }
    }
    notifyPaymentSuccess(orderData) {
        if (this.io) {
            this.io.to("admin-room").emit("payment:success", {
                type: "PAYMENT_SUCCESS",
                message: "Thanh toán thành công!",
                data: orderData,
                timestamp: new Date().toISOString(),
            });
            console.log("💰 Sent payment success notification to admin");
        }
    }
    notifyOrderStatusUpdate(orderData) {
        if (this.io) {
            this.io.to("admin-room").emit("order:statusUpdate", {
                type: "ORDER_STATUS_UPDATE",
                message: `Đơn hàng đã được cập nhật trạng thái: ${orderData.status}`,
                data: orderData,
                timestamp: new Date().toISOString(),
            });
            console.log("🔄 Sent order status update notification");
        }
    }
    notifyUser(userId, event, data) {
        if (this.io) {
            this.io.to(`user-${userId}`).emit(event, data);
        }
    }
}
const socketService = new SocketService();
exports.default = socketService;
