import { Express } from "express";
import userRouter from "./user.route";
import dashboardRouter from "./dashboard.route";
import dotenv from "dotenv";
dotenv.config();
export const routerAppVer1ForAdmin = (app: Express): void => {
  const prefixVersion1 = process.env.PREFIX_ADMIN;
  app.use(prefixVersion1 + "/users", userRouter);
  app.use(prefixVersion1 + "/dashboards", dashboardRouter);
};

export default routerAppVer1ForAdmin;
