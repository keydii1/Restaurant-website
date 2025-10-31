import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import * as controller from "../controllers/user.controller";
const router = express.Router();
router.get("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
export default router;
