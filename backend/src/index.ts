import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import * as database from "./config/database.config";
dotenv.config();
database.connect();

const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
