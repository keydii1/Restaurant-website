# 🎤 BÀI THUYẾT TRÌNH BACKEND - HỆ THỐNG QUẢN LÝ NHÀ HÀNG

## 📅 TIMELINE THUYẾT TRÌNH (15 PHÚT)

| Thời Gian     | Nội Dung                           | Ghi Chú           |
| ------------- | ---------------------------------- | ----------------- |
| 0:00 - 1:00   | Giới thiệu tổng quan dự án         | Mở Swagger UI sẵn |
| 1:00 - 3:00   | Kiến trúc & Tech Stack             | Vẽ sơ đồ nếu cần  |
| 3:00 - 5:00   | Cấu trúc thư mục & Design patterns | Mở VS Code        |
| 5:00 - 8:00   | Demo 3 tính năng chính             | Test trực tiếp    |
| 8:00 - 11:00  | Authentication & Security          | Giải thích code   |
| 11:00 - 13:00 | Socket.IO Real-time                | Demo notification |
| 13:00 - 15:00 | Tổng kết & Q&A                     | Sẵn sàng trả lời  |

---

## 📝 NỘI DUNG CHI TIẾT

### 1️⃣ GIỚI THIỆU (1 phút)

**Script nói:**

> "Dự án này là hệ thống quản lý nhà hàng với đầy đủ tính năng: quản lý món ăn, đặt bàn, giỏ hàng, đơn hàng và thanh toán online qua MoMo. Backend được xây dựng theo REST API với 61 endpoints."

**Điểm nhấn:**

- 61 API endpoints
- 9 modules chính (Users, Dishes, Categories, Carts, Orders, Tables, Discounts, Blogs, Contacts)
- Real-time notifications với Socket.IO

---

### 2️⃣ KIẾN TRÚC & TECH STACK (2 phút)

**Sơ đồ kiến trúc:**

```
Client (React) → Express.js API → MongoDB
       ↑                ↓
   Socket.IO ←→ Real-time Events
       ↑
   Cloudinary (Images)
```

**Tech Stack giải thích:**
| Công Nghệ | Lý Do Chọn |
|-----------|-----------|
| **Express.js 5** | Framework nhẹ, linh hoạt, ecosystem lớn |
| **TypeScript** | Type-safe, dễ maintain, giảm bugs |
| **MongoDB + Mongoose** | NoSQL flexible, schema validation |
| **JWT** | Stateless authentication, scalable |
| **Socket.IO** | Real-time bidirectional communication |
| **Cloudinary** | CDN images, không cần storage server |

---

### 3️⃣ CẤU TRÚC THƯ MỤC (2 phút)

**Script nói:**

> "Em sử dụng cấu trúc MVC-like với separation of concerns rõ ràng..."

```
src/
├── controllers/  → Xử lý request/response (logic điều khiển)
├── models/       → Mongoose schemas (cấu trúc dữ liệu)
├── routes/       → Định nghĩa endpoints (routing)
├── middlewares/  → Xử lý trung gian (auth, upload)
├── validates/    → Validation input (kiểm tra dữ liệu)
├── services/     → Business logic (Socket.IO)
├── core/         → Response classes (chuẩn hóa response)
├── utils/        → Helper functions (token, email)
└── auth/         → Authentication middleware
```

**Design Patterns:**

1. **MVC Pattern** - Tách riêng Model, View(Route), Controller
2. **Middleware Pattern** - Chain of responsibility
3. **Singleton Pattern** - SocketService
4. **Factory Pattern** - Response classes (OK, Created)

---

### 4️⃣ DEMO 3 TÍNH NĂNG CHÍNH (3 phút)

#### Demo 1: User Authentication

1. Mở Swagger → `/users/register` → Tạo user
2. `/users/login` → Lấy accessToken
3. Copy token → Authorize → Test protected routes

#### Demo 2: CRUD Dishes

1. `/dishes` → GET danh sách
2. `/dishes/create` → POST với image upload
3. `/dishes/change-status` → PATCH đổi trạng thái

#### Demo 3: Order Flow

1. `/carts/add` → Thêm món vào giỏ
2. `/orders/create` → Tạo đơn hàng
3. Xem Socket notification (nếu có)

---

### 5️⃣ AUTHENTICATION & SECURITY (3 phút)

**Script nói:**

> "Em implement 2 levels authentication: `auth` cho user thường và `authAdmin` cho admin..."

**Giải thích code `checkAuth.auth.ts`:**

```typescript
// Middleware auth - Kiểm tra user đã đăng nhập
const auth = async (req, res, next) => {
  // 1. Lấy token từ header "Bearer xxx"
  const authHeader = req.headers.authorization;
  const token = authHeader.substring(7); // Bỏ "Bearer "

  // 2. Verify token
  const decoded = await verifyToken(token);

  // 3. Gán vào request để controller dùng
  req.accessToken = decoded;
  next();
};

// Middleware authAdmin - Kiểm tra quyền admin
const authAdmin = async (req, res, next) => {
  // ... verify token
  const user = await User.findById(decoded.id);
  if (!user.isAdmin) {
    return res.status(403).json({ message: "Không có quyền admin" });
  }
  next();
};
```

**JWT Token Flow:**

```
Login → Server tạo accessToken (1 ngày) + refreshToken (7 ngày)
      → accessToken lưu client, refreshToken lưu cookie HttpOnly
      → Mỗi request gửi accessToken trong header
      → Hết hạn → Gọi /refresh-token để lấy token mới
```

---

### 6️⃣ SOCKET.IO REAL-TIME (2 phút)

**Script nói:**

> "Khi có đơn hàng mới hoặc thanh toán thành công, admin sẽ nhận thông báo real-time..."

**Giải thích code `socket.service.ts`:**

```typescript
class SocketService {
  private io: SocketIOServer;

  // Admin join vào room riêng
  socket.on("admin:join", () => {
    socket.join("admin-room");
  });

  // Gửi notification đến admin
  notifyNewOrder(orderData) {
    this.io.to("admin-room").emit("order:new", {
      type: "NEW_ORDER",
      data: orderData,
      timestamp: new Date()
    });
  }
}
```

**Events:**

- `order:new` - Đơn hàng mới
- `payment:success` - Thanh toán thành công
- `order:statusUpdate` - Cập nhật trạng thái

---

### 7️⃣ TỔNG KẾT (2 phút)

**Những gì đã làm được:**
✅ REST API hoàn chỉnh với 61 endpoints  
✅ Authentication JWT với refresh token  
✅ Role-based authorization (User/Admin)  
✅ Real-time notifications với Socket.IO  
✅ Image upload với Cloudinary  
✅ Email notifications (forgot password, thank you)  
✅ Payment integration MoMo  
✅ API documentation với Swagger

**Hạn chế & Có thể cải thiện:**

- Chưa có unit tests
- Chưa có rate limiting
- Có thể thêm caching với Redis

---

## ❓ CÂU HỎI THẦY CÓ THỂ HỎI & CÁCH TRẢ LỜI

### Câu 1: "Tại sao chọn MongoDB thay vì MySQL?"

> **Trả lời:** "MongoDB phù hợp với dự án này vì:
>
> 1. Schema linh hoạt - món ăn có thể có ingredients khác nhau
> 2. Dễ scale horizontal cho restaurant chain
> 3. Mongoose ODM hỗ trợ validation như SQL
> 4. JSON format native, phù hợp với REST API"

### Câu 2: "JWT lưu ở đâu? Bảo mật như thế nào?"

> **Trả lời:** "AccessToken do client quản lý (localStorage hoặc memory), RefreshToken lưu trong HttpOnly cookie để tránh XSS. AccessToken ngắn hạn 1 ngày, nếu bị lộ thì thiệt hại giới hạn."

### Câu 3: "Tại sao dùng 2 middleware auth và authAdmin thay vì 1?"

> **Trả lời:** "Để tái sử dụng - nhiều route chỉ cần user đăng nhập (như xem profile), không cần admin. Nếu gộp chung thì user thường không thể access."

### Câu 4: "Nếu token bị đánh cắp thì sao?"

> **Trả lời:** "AccessToken expire sau 1 ngày. Có thể implement thêm:
>
> - Token blacklist khi logout
> - Device fingerprint
> - Refresh token rotation"

### Câu 5: "Socket.IO khác với WebSocket thuần như thế nào?"

> **Trả lời:** "Socket.IO là abstraction layer trên WebSocket, cung cấp thêm:
>
> - Auto reconnection
> - Fallback (long-polling nếu WS fail)
> - Rooms/namespaces
> - Broadcasting"

### Câu 6: "Em xử lý lỗi như thế nào?"

> **Trả lời:** "Em tạo các class response chuẩn trong `/core`:
>
> - `OK`, `Created` cho success
> - `BadRequestError`, `UnauthorizedError` cho errors
>   Tất cả response có format `{ message, statusCode, metadata }`"

### Câu 7: "Validation input ở đâu?"

> **Trả lời:** "Trong folder `/validates`, mỗi module có file validate riêng. Ví dụ `user.validate.ts` kiểm tra email format, password strength, username unique... Các validator được chain trong route như middleware."

### Câu 8: "Làm sao upload image?"

> **Trả lời:** "Dùng Multer để parse multipart/form-data, sau đó upload lên Cloudinary qua API. Cloudinary trả về URL, em lưu URL vào database thay vì file gốc."

### Câu 9: "Tại sao dùng Singleton cho SocketService?"

> **Trả lời:** "Để đảm bảo chỉ có 1 instance Socket.IO server trong toàn bộ app. Nếu tạo nhiều instance sẽ conflict port và logic."

### Câu 10: "Làm sao test API?"

> **Trả lời:** "Dùng Swagger UI tại `/restaurant/api/v1/docs`. Em cũng có thể dùng Postman. Có endpoint `/orders/test-socket` để test real-time notification."

---

## 💡 TIPS THUYẾT TRÌNH

1. **Mở sẵn các tab:**

   - VS Code với project
   - Swagger UI
   - Terminal (nếu cần restart server)

2. **Chuẩn bị data demo:**

   - Có sẵn 1 user test
   - Có sẵn 1 món ăn, 1 category
   - Có sẵn 1 đơn hàng

3. **Khi demo bị lỗi:**

   - Bình tĩnh, nói "để em check lại"
   - Giải thích lý do lỗi nếu biết
   - Chuyển sang phần khác nếu không fix được

4. **Khi không biết trả lời:**
   - "Em sẽ nghiên cứu thêm phần này"
   - "Đây là điểm em có thể cải thiện"
