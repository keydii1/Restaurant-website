# 🍽️ Restaurant Management System - Backend API

A comprehensive restaurant management system with features for managing dishes, table reservations, shopping carts, orders, discount codes, and more.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Scripts](#-scripts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Socket.IO Events](#-socketio-events)

---

## ✨ Features

- **🔐 User Authentication** - Register, login, JWT tokens, Google OAuth
- **🍜 Dish Management** - CRUD dishes with images, prices, categories
- **📂 Category Management** - Organize dishes by categories
- **🛒 Shopping Cart** - Add, remove, update item quantities
- **📝 Order Management** - Create orders, track status, MoMo payment
- **🪑 Table Management** - Reserve tables, check availability
- **🎫 Discount Codes** - Create and manage vouchers
- **📰 Blog Management** - Create posts with images
- **📧 Contact Form** - Customer inquiries with email notifications
- **🔔 Real-time Notifications** - Socket.IO for new orders

---

## 🛠️ Tech Stack

| Technology       | Description             |
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

## 🚀 Installation

### Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)
- npm or yarn

### Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with required environment variables
# (See .env.example for required variables)

# 4. Start development server
npm run dev
```

Server will run at: `http://localhost:3000`

---

## 📜 Scripts

| Script          | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Run development server with hot-reload |
| `npm run build` | Build TypeScript to JavaScript         |
| `npm start`     | Run production server from `dist/`     |
| `npm test`      | Run tests (not configured)             |

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/               # Authentication middleware
│   ├── config/             # Database configuration
│   ├── controllers/        # Request handlers (9 files)
│   ├── core/               # Response classes
│   ├── helpers/            # Utility helpers
│   ├── middlewares/        # Express middlewares
│   ├── models/             # Mongoose schemas (11 files)
│   ├── routes/             # API routes (10 files)
│   ├── services/           # Business logic services
│   ├── utils/              # Utilities & email templates
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

Swagger UI is available at:

| Environment     | URL                                                                 |
| --------------- | ------------------------------------------------------------------- |
| **Development** | http://localhost:3000/restaurant/api/v1/docs                        |
| **Production**  | https://restaurant-website-s8zb.onrender.com/restaurant/api/v1/docs |

---

## 🔗 API Endpoints

### 👤 Users (12 endpoints)

| Method | Endpoint                      | Auth   | Description       |
| ------ | ----------------------------- | ------ | ----------------- |
| GET    | `/users`                      | Admin  | Get all users     |
| POST   | `/users/register`             | Public | Register new user |
| POST   | `/users/login`                | Public | Login             |
| POST   | `/users/forgot-password`      | Public | Forgot password   |
| POST   | `/users/verify-otp`           | Public | Verify OTP        |
| PATCH  | `/users/reset-password`       | Public | Reset password    |
| GET    | `/users/profile`              | Auth   | Get profile       |
| PATCH  | `/users/edit-profile`         | Auth   | Update profile    |
| GET    | `/users/logout`               | Public | Logout            |
| POST   | `/users/refresh-token`        | Public | Refresh token     |
| GET    | `/users/auth/google`          | Public | Google OAuth      |
| GET    | `/users/auth/google/callback` | Public | Google callback   |

### 🍜 Dishes (9 endpoints)

| Method | Endpoint                            | Auth   | Description            |
| ------ | ----------------------------------- | ------ | ---------------------- |
| GET    | `/dishes`                           | Public | Get dishes (paginated) |
| GET    | `/dishes/all`                       | Public | Get all dishes         |
| GET    | `/dishes/search`                    | Public | Search dishes          |
| POST   | `/dishes/create`                    | Admin  | Create dish            |
| GET    | `/dishes/detail/:id`                | Auth   | Get dish detail        |
| PATCH  | `/dishes/edit/:id`                  | Admin  | Update dish            |
| DELETE | `/dishes/delete/:id`                | Admin  | Delete dish            |
| PATCH  | `/dishes/change-status/:id/:status` | Admin  | Change status          |
| PATCH  | `/dishes/change-multi`              | Admin  | Bulk update            |

### 📂 Categories (6 endpoints)

| Method | Endpoint                                | Auth   | Description     |
| ------ | --------------------------------------- | ------ | --------------- |
| GET    | `/categories`                           | Public | Get categories  |
| POST   | `/categories/create`                    | Admin  | Create category |
| PATCH  | `/categories/edit/:id`                  | Admin  | Update category |
| DELETE | `/categories/delete/:id`                | Admin  | Delete category |
| PATCH  | `/categories/change-status/:id/:status` | Admin  | Change status   |
| PATCH  | `/categories/change-multi`              | Admin  | Bulk update     |

### 🛒 Carts (5 endpoints)

| Method | Endpoint             | Auth | Description      |
| ------ | -------------------- | ---- | ---------------- |
| GET    | `/carts`             | Auth | Get cart         |
| POST   | `/carts/add`         | Auth | Add item to cart |
| POST   | `/carts/edit`        | Auth | Update quantity  |
| DELETE | `/carts/delete-item` | Auth | Remove item      |
| DELETE | `/carts/clear`       | Auth | Clear cart       |

### 📝 Orders (10 endpoints)

| Method | Endpoint                   | Auth   | Description         |
| ------ | -------------------------- | ------ | ------------------- |
| GET    | `/orders`                  | Admin  | Get all orders      |
| GET    | `/orders/my-orders`        | Auth   | Get user's orders   |
| GET    | `/orders/detail/:id`       | Admin  | Get order detail    |
| POST   | `/orders/create`           | Auth   | Create order        |
| PATCH  | `/orders/edit/:id`         | Auth   | Update order        |
| PATCH  | `/orders/edit/:id/status`  | Admin  | Update status       |
| PATCH  | `/orders/edit/:id/payment` | Admin  | Update payment      |
| POST   | `/orders/create-payment`   | Public | Create MoMo payment |
| GET    | `/orders/result`           | Public | Payment result      |
| POST   | `/orders/test-socket`      | Public | Test socket         |

### 🪑 Tables (5 endpoints)

| Method | Endpoint                    | Auth  | Description   |
| ------ | --------------------------- | ----- | ------------- |
| GET    | `/tables`                   | Auth  | Get tables    |
| POST   | `/tables/create`            | Admin | Create table  |
| PATCH  | `/tables/edit/:id`          | Auth  | Update table  |
| DELETE | `/tables/delete/:id`        | Admin | Delete table  |
| PATCH  | `/tables/change-status/:id` | Admin | Change status |

### 🎫 Discounts (5 endpoints)

| Method | Endpoint                | Auth  | Description          |
| ------ | ----------------------- | ----- | -------------------- |
| GET    | `/discounts`            | Auth  | Get active discounts |
| GET    | `/discounts/all`        | Admin | Get all discounts    |
| POST   | `/discounts/create`     | Admin | Create discount      |
| PATCH  | `/discounts/edit/:id`   | Admin | Update discount      |
| DELETE | `/discounts/delete/:id` | Admin | Delete discount      |

### 📰 Blogs (5 endpoints)

| Method | Endpoint            | Auth   | Description     |
| ------ | ------------------- | ------ | --------------- |
| GET    | `/blogs`            | Public | Get blogs       |
| GET    | `/blogs/detail/:id` | Public | Get blog detail |
| POST   | `/blogs/create`     | Admin  | Create blog     |
| PATCH  | `/blogs/edit/:id`   | Admin  | Update blog     |
| DELETE | `/blogs/delete/:id` | Admin  | Delete blog     |

### 📧 Contacts (4 endpoints)

| Method | Endpoint               | Auth   | Description    |
| ------ | ---------------------- | ------ | -------------- |
| GET    | `/contacts`            | Admin  | Get contacts   |
| POST   | `/contacts/create`     | Public | Submit contact |
| PATCH  | `/contacts/edit/:id`   | Admin  | Update status  |
| DELETE | `/contacts/delete/:id` | Admin  | Delete contact |

---

## 🔒 Authentication

API uses JWT Bearer Token:

```bash
# Header format
Authorization: Bearer <access_token>
```

**Auth levels:**

- `Public` - No token required
- `Auth` - Requires access token (logged-in user)
- `Admin` - Requires token with admin privileges

---

## 🔔 Socket.IO Events

Server emits the following events:

| Event               | Description          |
| ------------------- | -------------------- |
| `newOrder`          | New order created    |
| `orderStatusUpdate` | Order status changed |
| `paymentSuccess`    | Payment completed    |

**Test page:** http://localhost:3000/socket-test

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Ho Hoang Son**

📧 Email: hoson2k5@gmail.com
