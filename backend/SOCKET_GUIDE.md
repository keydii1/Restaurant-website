# Hướng dẫn sử dụng Socket.IO - Thông báo thanh toán Real-time

## Tổng quan

Tính năng Socket.IO đã được tích hợp vào backend để gửi thông báo real-time đến trang admin khi có thanh toán thành công.

## Backend đã cấu hình

### Các file đã tạo/sửa đổi:

1. `src/services/socket.service.ts` - Service quản lý Socket.IO
2. `src/index.ts` - Khởi tạo Socket.IO server
3. `src/controllers/order.controller.ts` - Emit event khi thanh toán thành công

### Events được emit:

- `payment:success` - Khi thanh toán thành công
- `order:new` - Khi có đơn hàng mới (có thể thêm sau)
- `order:statusUpdate` - Khi cập nhật trạng thái đơn hàng

---

## Hướng dẫn Frontend (React/Next.js)

### 1. Cài đặt socket.io-client

```bash
npm install socket.io-client
# hoặc
yarn add socket.io-client
```

### 2. Tạo Socket Context (Recommended)

Tạo file `context/SocketContext.tsx`:

```tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Kết nối đến backend server
    const socketInstance = io("http://localhost:3000", {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

### 3. Wrap App với SocketProvider

Trong `_app.tsx` hoặc `layout.tsx`:

```tsx
import { SocketProvider } from "@/context/SocketContext";

function MyApp({ Component, pageProps }) {
  return (
    <SocketProvider>
      <Component {...pageProps} />
    </SocketProvider>
  );
}

export default MyApp;
```

### 4. Sử dụng trong trang Admin Order

Tạo component `AdminOrderNotification.tsx`:

```tsx
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { toast } from "react-toastify"; // hoặc notification library bạn đang dùng

interface PaymentNotification {
  type: string;
  message: string;
  data: {
    orderId: string;
    email: string;
    order: any;
    message: string;
  };
  timestamp: string;
}

const AdminOrderNotification: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Đăng ký admin vào room để nhận thông báo
    socket.emit("admin:join");

    // Lắng nghe event thanh toán thành công
    socket.on("payment:success", (data: PaymentNotification) => {
      console.log("💰 Payment Success:", data);

      // Thêm vào danh sách notifications
      setNotifications((prev) => [data, ...prev]);

      // Hiển thị toast notification
      toast.success(`🎉 ${data.data.message}`, {
        position: "top-right",
        autoClose: 5000,
      });

      // Có thể phát âm thanh thông báo
      playNotificationSound();
    });

    // Lắng nghe event đơn hàng mới
    socket.on("order:new", (data) => {
      console.log("📦 New Order:", data);
      toast.info(`📦 ${data.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    // Cleanup khi component unmount
    return () => {
      socket.emit("admin:leave");
      socket.off("payment:success");
      socket.off("order:new");
    };
  }, [socket]);

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((err) => console.log("Audio play failed:", err));
  };

  return (
    <div className="admin-notifications">
      {/* Badge hiển thị số thông báo mới */}
      {notifications.length > 0 && (
        <div className="notification-badge">{notifications.length}</div>
      )}

      {/* Danh sách thông báo */}
      <div className="notification-list">
        {notifications.map((notif, index) => (
          <div key={index} className="notification-item">
            <span className="notification-time">
              {new Date(notif.timestamp).toLocaleTimeString()}
            </span>
            <span className="notification-message">{notif.data.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrderNotification;
```

### 5. Tích hợp vào trang Admin Orders

```tsx
import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import AdminOrderNotification from "@/components/AdminOrderNotification";

const AdminOrdersPage: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch initial orders
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Đăng ký admin
    socket.emit("admin:join");

    // Khi có thanh toán mới, refresh danh sách orders
    socket.on("payment:success", (data) => {
      console.log("Payment received, refreshing orders...");
      fetchOrders(); // Refresh danh sách đơn hàng
    });

    return () => {
      socket.emit("admin:leave");
      socket.off("payment:success");
    };
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/restaurant/api/v1/orders"
      );
      const data = await response.json();
      setOrders(data.metadata);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="admin-orders-page">
      {/* Connection status */}
      <div
        className={`connection-status ${
          isConnected ? "connected" : "disconnected"
        }`}
      >
        {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
      </div>

      {/* Notification component */}
      <AdminOrderNotification />

      {/* Orders list */}
      <div className="orders-list">
        {orders.map((order: any) => (
          <div key={order._id} className="order-item">
            {/* Render order info */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
```

---

## Custom Hook (Alternative)

Tạo `hooks/usePaymentNotification.ts`:

```tsx
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

interface PaymentData {
  orderId: string;
  email: string;
  order: any;
  message: string;
}

export const usePaymentNotification = (
  onPaymentSuccess?: (data: PaymentData) => void
) => {
  const { socket, isConnected } = useSocket();
  const [lastPayment, setLastPayment] = useState<PaymentData | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("admin:join");

    socket.on("payment:success", (notification) => {
      setLastPayment(notification.data);
      if (onPaymentSuccess) {
        onPaymentSuccess(notification.data);
      }
    });

    return () => {
      socket.emit("admin:leave");
      socket.off("payment:success");
    };
  }, [socket, onPaymentSuccess]);

  return { isConnected, lastPayment };
};
```

Sử dụng:

```tsx
const AdminPage = () => {
  const { isConnected, lastPayment } = usePaymentNotification((data) => {
    console.log("New payment:", data);
    // Handle notification
  });

  return <div>...</div>;
};
```

---

## CSS Styles (Optional)

```css
.connection-status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.connection-status.connected {
  background-color: #d4edda;
  color: #155724;
}

.connection-status.disconnected {
  background-color: #f8d7da;
  color: #721c24;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.notification-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.notification-time {
  font-size: 12px;
  color: #666;
}

.notification-message {
  font-size: 14px;
  color: #333;
}
```

---

## Testing

1. Khởi động backend: `npm run dev`
2. Mở trang admin và kiểm tra connection status
3. Thực hiện thanh toán từ frontend
4. Kiểm tra thông báo hiển thị trên trang admin

## Lưu ý

- Trong production, thay đổi `origin: "*"` thành domain cụ thể
- Có thể thêm authentication cho socket connection
- Có thể lưu notifications vào database để hiển thị lịch sử
