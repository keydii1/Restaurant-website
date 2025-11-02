import express, { Router } from "express";
import * as controller from "../controllers/category.controller";
const router = Router();

router.get("/", controller.getCategories);
export default router;
