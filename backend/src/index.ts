import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as database from "./config/database.config";
import routerAppVer1 from "./routes/index.route";
dotenv.config();
database.connect();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;
// Middleware
app.use(cors({
  origin: "*", // Cho phép tất cả origin (nên thay đổi trong production)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
routerAppVer1(app); // Routes

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
