# 🍽️ Restaurant Management System - Backend API

Hệ thống quản lý nhà hàng với đầy đủ tính năng: quản lý món ăn, đặt bàn, giỏ hàng, đơn hàng, mã giảm giá, và hơn thế nữa.

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ](#-công-nghệ)
- [Cài Đặt](#-cài-đặt)
- [Biến Môi Trường](#-biến-môi-trường)
- [Scripts](#-scripts)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)

---

## ✨ Tính Năng

- **🔐 Xác thực người dùng** - Đăng ký, đăng nhập, JWT tokens, Google OAuth
- **🍜 Quản lý món ăn** - CRUD món ăn với hình ảnh, giá, danh mục
- **📂 Quản lý danh mục** - Phân loại món ăn theo danh mục
- **🛒 Giỏ hàng** - Thêm, xóa, cập nhật số lượng món
- **📝 Đơn hàng** - Tạo đơn, theo dõi trạng thái, thanh toán MoMo
- **🪑 Quản lý bàn** - Đặt bàn, kiểm tra trạng thái
- **🎫 Mã giảm giá** - Tạo và quản lý voucher
- **📰 Blog** - Đăng bài viết với hình ảnh
- **📧 Liên hệ** - Form liên hệ với email thông báo
- **🔔 Real-time** - Socket.IO thông báo đơn hàng mới

---

## 🛠️ Công Nghệ

| Công Nghệ        | Mô Tả                   |
| ---------------- | ----------------------- |
| **Node.js**      | Runtime environment     |
| **Express.js 5** | Web framework           |
| **TypeScript**   | Type-safe JavaScript    |
| **MongoDB**      | NoSQL database          |
| **Mongoose**     | ODM for MongoDB         |
| **JWT**          | Authentication tokens   |
| **Socket.IO**    | Real-time communication |
| **Cloudinary**   | Image hosting           |
| **Nodemailer**   | Email service           |
| **MoMo**         | Payment integration     |
| **Swagger**      | API documentation       |

---

## 🚀 Cài Đặt

### Yêu Cầu

- Node.js >= 18.x
- MongoDB (local hoặc Atlas)
- npm hoặc yarn

### Các Bước

```bash
# 1. Clone repository
git clone <repository-url>
cd backend

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env (xem phần Biến Môi Trường)
cp .env.example .env

# 4. Khởi động development server
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

---

## 🔧 Biến Môi Trường

Tạo file `.env` trong thư mục `backend/`:

```env
# Server
PORT=3000
PREFIX=/restaurant/api/v1

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/restaurant

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/restaurant/api/v1/users/auth/google/callback

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

---

## 📜 Scripts

| Script          | Mô Tả                                  |
| --------------- | -------------------------------------- |
| `npm run dev`   | Chạy development server với hot-reload |
| `npm run build` | Build TypeScript sang JavaScript       |
| `npm start`     | Chạy production server từ `dist/`      |
| `npm test`      | Chạy tests (chưa cấu hình)             |

---

## 📁 Cấu Trúc Thư Mục

```
backend/
├── src/
│   ├── auth/               # Authentication middleware
│   │   └── checkAuth.auth.ts
│   ├── config/             # Database configuration
│   │   └── database.config.ts
│   ├── controllers/        # Request handlers
│   │   ├── user.controller.ts
│   │   ├── dish.controller.ts
│   │   ├── category.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   ├── table.controller.ts
│   │   ├── discount.controller.ts
│   │   ├── blog.controller.ts
│   │   └── contact.controller.ts
│   ├── core/               # Response classes
│   │   ├── success.response.ts
│   │   └── error.response.ts
│   ├── helpers/            # Utility helpers
│   │   ├── generate.helper.ts
│   │   └── pagination.helper.ts
│   ├── middlewares/        # Express middlewares
│   │   └── uploadCloud.middleware.ts
│   ├── models/             # Mongoose schemas
│   │   ├── user.model.ts
│   │   ├── dish.model.ts
│   │   ├── category.model.ts
│   │   ├── cart.model.ts
│   │   ├── order.model.ts
│   │   ├── table.model.ts
│   │   ├── discount.model.ts
│   │   ├── blog.model.ts
│   │   ├── contact.model.ts
│   │   └── otp.model.ts
│   ├── routes/             # API routes
│   │   ├── index.route.ts
│   │   ├── user.route.ts
│   │   ├── dish.route.ts
│   │   └── ... (9 route files)
│   ├── services/           # Business logic services
│   │   └── socket.service.ts
│   ├── utils/              # Utilities
│   │   ├── auth/           # Token services
│   │   └── SendMail/       # Email templates
│   ├── validates/          # Request validation
│   └── index.ts            # Entry point
├── dist/                   # Compiled JavaScript
├── views/                  # Static HTML files
├── uploads/                # Temporary upload folder
├── restaurant_swagger.yaml # API documentation
├── package.json
├── tsconfig.json
└── .env
```

---

## 📚 API Documentation

Swagger UI có sẵn tại:

| Environment     | URL                                                                 |
| --------------- | ------------------------------------------------------------------- |
| **Development** | http://localhost:3000/restaurant/api/v1/docs                        |
| **Production**  | https://restaurant-website-s8zb.onrender.com/restaurant/api/v1/docs |

---

## 🔗 API Endpoints

### 👤 Users (12 endpoints)

| Method | Endpoint                      | Auth   | Description         |
| ------ | ----------------------------- | ------ | ------------------- |
| GET    | `/users`                      | Admin  | Lấy danh sách users |
| POST   | `/users/register`             | Public | Đăng ký             |
| POST   | `/users/login`                | Public | Đăng nhập           |
| POST   | `/users/forgot-password`      | Public | Quên mật khẩu       |
| POST   | `/users/verify-otp`           | Public | Xác thực OTP        |
| PATCH  | `/users/reset-password`       | Public | Đặt lại mật khẩu    |
| GET    | `/users/profile`              | Auth   | Lấy profile         |
| PATCH  | `/users/edit-profile`         | Auth   | Cập nhật profile    |
| GET    | `/users/logout`               | Public | Đăng xuất           |
| POST   | `/users/refresh-token`        | Public | Refresh token       |
| GET    | `/users/auth/google`          | Public | Google OAuth        |
| GET    | `/users/auth/google/callback` | Public | Google callback     |

### 🍜 Dishes (9 endpoints)

| Method | Endpoint                            | Auth   | Description                |
| ------ | ----------------------------------- | ------ | -------------------------- |
| GET    | `/dishes`                           | Public | Danh sách món (phân trang) |
| GET    | `/dishes/all`                       | Public | Tất cả món ăn              |
| GET    | `/dishes/search`                    | Public | Tìm kiếm món               |
| POST   | `/dishes/create`                    | Admin  | Tạo món mới                |
| GET    | `/dishes/detail/:id`                | Auth   | Chi tiết món               |
| PATCH  | `/dishes/edit/:id`                  | Admin  | Cập nhật món               |
| DELETE | `/dishes/delete/:id`                | Admin  | Xóa món                    |
| PATCH  | `/dishes/change-status/:id/:status` | Admin  | Đổi trạng thái             |
| PATCH  | `/dishes/change-multi`              | Admin  | Thay đổi nhiều món         |

### 📂 Categories (6 endpoints)

| Method | Endpoint                                | Auth   | Description             |
| ------ | --------------------------------------- | ------ | ----------------------- |
| GET    | `/categories`                           | Public | Danh sách danh mục      |
| POST   | `/categories/create`                    | Admin  | Tạo danh mục            |
| PATCH  | `/categories/edit/:id`                  | Admin  | Cập nhật danh mục       |
| DELETE | `/categories/delete/:id`                | Admin  | Xóa danh mục            |
| PATCH  | `/categories/change-status/:id/:status` | Admin  | Đổi trạng thái          |
| PATCH  | `/categories/change-multi`              | Admin  | Thay đổi nhiều danh mục |

### 🛒 Carts (5 endpoints)

| Method | Endpoint             | Auth | Description      |
| ------ | -------------------- | ---- | ---------------- |
| GET    | `/carts`             | Auth | Lấy giỏ hàng     |
| POST   | `/carts/add`         | Auth | Thêm món vào giỏ |
| POST   | `/carts/edit`        | Auth | Sửa số lượng     |
| DELETE | `/carts/delete-item` | Auth | Xóa 1 món        |
| DELETE | `/carts/clear`       | Auth | Xóa toàn bộ      |

### 📝 Orders (10 endpoints)

| Method | Endpoint                   | Auth   | Description              |
| ------ | -------------------------- | ------ | ------------------------ |
| GET    | `/orders`                  | Admin  | Tất cả đơn hàng          |
| GET    | `/orders/my-orders`        | Auth   | Đơn hàng của user        |
| GET    | `/orders/detail/:id`       | Admin  | Chi tiết đơn             |
| POST   | `/orders/create`           | Auth   | Tạo đơn mới              |
| PATCH  | `/orders/edit/:id`         | Auth   | Cập nhật đơn             |
| PATCH  | `/orders/edit/:id/status`  | Admin  | Cập nhật trạng thái      |
| PATCH  | `/orders/edit/:id/payment` | Admin  | Cập nhật thanh toán      |
| POST   | `/orders/create-payment`   | Public | Tạo thanh toán MoMo      |
| GET    | `/orders/result`           | Public | Kết quả thanh toán       |
| POST   | `/orders/test-socket`      | Public | Test socket notification |

### 🪑 Tables (5 endpoints)

| Method | Endpoint                    | Auth  | Description        |
| ------ | --------------------------- | ----- | ------------------ |
| GET    | `/tables`                   | Auth  | Danh sách bàn      |
| POST   | `/tables/create`            | Admin | Tạo bàn mới        |
| PATCH  | `/tables/edit/:id`          | Auth  | Cập nhật bàn       |
| DELETE | `/tables/delete/:id`        | Admin | Xóa bàn            |
| PATCH  | `/tables/change-status/:id` | Admin | Đổi trạng thái bàn |

### 🎫 Discounts (5 endpoints)

| Method | Endpoint                | Auth  | Description          |
| ------ | ----------------------- | ----- | -------------------- |
| GET    | `/discounts`            | Auth  | Mã giảm giá hiện tại |
| GET    | `/discounts/all`        | Admin | Tất cả mã giảm giá   |
| POST   | `/discounts/create`     | Admin | Tạo mã mới           |
| PATCH  | `/discounts/edit/:id`   | Admin | Cập nhật mã          |
| DELETE | `/discounts/delete/:id` | Admin | Xóa mã               |

### 📰 Blogs (5 endpoints)

| Method | Endpoint            | Auth   | Description    |
| ------ | ------------------- | ------ | -------------- |
| GET    | `/blogs`            | Public | Danh sách blog |
| GET    | `/blogs/detail/:id` | Public | Chi tiết blog  |
| POST   | `/blogs/create`     | Admin  | Tạo blog       |
| PATCH  | `/blogs/edit/:id`   | Admin  | Cập nhật blog  |
| DELETE | `/blogs/delete/:id` | Admin  | Xóa blog       |

### 📧 Contacts (4 endpoints)

| Method | Endpoint               | Auth   | Description         |
| ------ | ---------------------- | ------ | ------------------- |
| GET    | `/contacts`            | Admin  | Danh sách liên hệ   |
| POST   | `/contacts/create`     | Public | Gửi liên hệ         |
| PATCH  | `/contacts/edit/:id`   | Admin  | Cập nhật trạng thái |
| DELETE | `/contacts/delete/:id` | Admin  | Xóa liên hệ         |

---

## 🔒 Authentication

API sử dụng JWT Bearer Token:

```bash
# Header format
Authorization: Bearer <access_token>
```

**Auth levels:**

- `Public` - Không cần token
- `Auth` - Cần access token (user đã đăng nhập)
- `Admin` - Cần token với quyền admin

---

## 🔔 Socket.IO Events

Server phát các events sau:

| Event               | Description             |
| ------------------- | ----------------------- |
| `newOrder`          | Đơn hàng mới được tạo   |
| `orderStatusUpdate` | Cập nhật trạng thái đơn |
| `paymentSuccess`    | Thanh toán thành công   |

**Test page:** http://localhost:3000/socket-test

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Hồ Hoàng Sơn**

📧 Email: hoson2k5@gmail.com
