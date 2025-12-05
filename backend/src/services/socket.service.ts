import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";

class SocketService {
  private io: SocketIOServer | null = null;
  private adminSockets: Set<string> = new Set(); // Lưu trữ socket ID của admin

  // Khởi tạo Socket.IO server
  initialize(httpServer: HTTPServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*", // Trong production nên thay đổi thành domain cụ thể
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.io.on("connection", (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Admin join room để nhận thông báo
      socket.on("admin:join", () => {
        socket.join("admin-room");
        this.adminSockets.add(socket.id);
        console.log(`👤 Admin joined: ${socket.id}`);
      });

      // Admin rời room
      socket.on("admin:leave", () => {
        socket.leave("admin-room");
        this.adminSockets.delete(socket.id);
        console.log(`👤 Admin left: ${socket.id}`);
      });

      // Client disconnect
      socket.on("disconnect", () => {
        this.adminSockets.delete(socket.id);
        console.log(`❌ Client disconnected: ${socket.id}`);
      });
    });

    console.log("🚀 Socket.IO server initialized");
    return this.io;
  }

  // Lấy instance của Socket.IO
  getIO(): SocketIOServer | null {
    return this.io;
  }

  // Gửi thông báo đơn hàng mới đến admin
  notifyNewOrder(orderData: any): void {
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

  // Gửi thông báo thanh toán thành công đến admin
  notifyPaymentSuccess(orderData: any): void {
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

  // Gửi thông báo cập nhật trạng thái đơn hàng
  notifyOrderStatusUpdate(orderData: any): void {
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

  // Gửi thông báo đến một user cụ thể
  notifyUser(userId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`user-${userId}`).emit(event, data);
    }
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;
