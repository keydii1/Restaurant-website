"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const database = __importStar(require("./config/database.config"));
const index_route_1 = __importDefault(require("./routes/index.route"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const socket_service_1 = __importDefault(require("./services/socket.service"));
const fileRestaurantSwagger = fs_1.default.readFileSync(path_1.default.resolve("restaurant_swagger.yaml"), "utf8");
const restaurantSwagger = yaml_1.default.parse(fileRestaurantSwagger);
dotenv_1.default.config();
database.connect();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
app.use("/restaurant/api/v1/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(restaurantSwagger));
app.use("/views", express_1.default.static(path_1.default.join(__dirname, "../views")));
app.get("/socket-test", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../views/socket_test.html"));
});
(0, index_route_1.default)(app);
const httpServer = (0, http_1.createServer)(app);
socket_service_1.default.initialize(httpServer);
app.get("/", (req, res) => {
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
