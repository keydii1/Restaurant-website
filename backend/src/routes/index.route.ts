import express, { Express, Router } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./user.route";
import dishRoutes from "./dish.route";

export const routerAppVer1 = (app: Express): void => {
  const version1 = process.env.PREFIX;
  app.use(version1 + "/users", userRoutes);
  app.use(version1 + "/dishes", dishRoutes);
};

export default routerAppVer1;
