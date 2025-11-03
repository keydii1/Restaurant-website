import express, { Express, Router } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import categoryRoutes from "./category.route";
import dishRoutes from "./dish.route";
import roleRoutes from "./role.route";
import userRoutes from "./user.route";

export const routerAppVer1 = (app: Express): void => {
  const version1 = process.env.PREFIX;
  app.use(version1 + "/categories", categoryRoutes);
  app.use(version1 + "/dishes", dishRoutes);
  app.use(version1 + "/users", userRoutes);
  app.use(version1 + "/roles", roleRoutes);
};

export default routerAppVer1;
