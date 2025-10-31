import { Express } from "express";
import homeRouter from "./home.route";
import dotenv from "dotenv";
dotenv.config();
export const routerAppVer1ForClient = (app: Express): void => {
  const prefixVersion1 = process.env.PREFIX_USER;
  app.use(prefixVersion1 + "/", homeRouter);
};

export default routerAppVer1ForClient;
