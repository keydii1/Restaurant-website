import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as database from "./config/database.config";
import routerAppVer1 from "./routes/index.route";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import path from "path";
import { createServer } from "http";
import socketService from "./services/socket.service";
const fileRestaurantSwagger = fs.readFileSync(
  path.resolve("restaurant_swagger.yaml"),
  "utf8"
);
const restaurantSwagger = yaml.parse(fileRestaurantSwagger);

dotenv.config();
database.connect();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

// Middleware
app.use(
  cors({
    origin: "*", // Cho phép tất cả origin (nên thay đổi trong production)
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cookie parser (không ảnh hưởng đến file upload)
app.use(cookieParser());

// Tăng giới hạn kích thước request body cho upload file (50MB)
// QUAN TRỌNG: Chỉ parse JSON và URL-encoded cho các route không có file upload
// Multer sẽ tự xử lý multipart/form-data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  "/restaurant/api/v1/docs",
  swaggerUi.serve,
  swaggerUi.setup(restaurantSwagger)
);

// Serve static files for socket test page
app.use("/views", express.static(path.join(__dirname, "../views")));

// Socket test page route
app.get("/socket-test", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../views/socket_test.html"));
});

routerAppVer1(app); // Routes

// Create HTTP server and initialize Socket.IO
const httpServer = createServer(app);
socketService.initialize(httpServer);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Restaurant API",
    version: "1.0.0",
    routes: {
      categories: "/restaurant/api/v1/categories",
      dishes: "/restaurant/api/v1/dishes",
      users: "/restaurant/api/v1/users",
      tables: "/restaurant/api/v1/tables",
      discounts: "/restaurant/api/v1/discounts",
      carts: "/restaurant/api/v1/carts",
      blogs: "/restaurant/api/v1/blogs",
      contacts: "/restaurant/api/v1/contacts",
      orders: "/restaurant/api/v1/orders",
    },
    status: "Success",
  });
});
httpServer.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Socket.IO is ready for connections`);
});
