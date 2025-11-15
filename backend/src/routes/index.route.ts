import express, { Express, Router } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import categoryRoutes from "./category.route";
import dishRoutes from "./dish.route";
import roleRoutes from "./role.route";
import userRoutes from "./user.route";
import paymentRoutes from "./payment.route";
import tableRoutes from "./table.route";
import discountRoutes from "./discount.route";
import cartRoutes from "./cart.route";
import blogRoutes from "./blog.route";
export const routerAppVer1 = (app: Express): void => {
  const version1 = process.env.PREFIX;
  app.use(version1 + "/categories", categoryRoutes);
  app.use(version1 + "/dishes", dishRoutes);
  app.use(version1 + "/users", userRoutes);
  app.use(version1 + "/roles", roleRoutes);
  app.use(version1 + "/payments", paymentRoutes);
  app.use(version1 + "/tables", tableRoutes);
  app.use(version1 + "/discounts", discountRoutes);
  app.use(version1 + "/carts", cartRoutes);
  app.use(version1 + "/blogs", blogRoutes);
};

export default routerAppVer1;
