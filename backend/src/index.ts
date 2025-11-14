import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as database from "./config/database.config";
import routerAppVer1 from "./routes/index.route";
dotenv.config();
database.connect();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;
// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
routerAppVer1(app); // Routes

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
