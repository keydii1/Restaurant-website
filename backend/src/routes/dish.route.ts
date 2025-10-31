import express, { Express, Request, Response } from "express";
import * as controller from "../controllers/dish.controller";
const router = express.Router();

router.get("/", controller.getAllDishes);

export default router;
