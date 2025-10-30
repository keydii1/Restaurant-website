import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import * as controller from "../../controllers/admin/dashboard.controller";
const router = express.Router();
router.get("/", controller.index);
export default router;
