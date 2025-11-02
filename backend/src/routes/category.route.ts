import express, { Router } from "express";
import * as controller from "../controllers/category.controller";
const router = Router();

router.get("/", controller.getCategories);
router.post("/create", controller.create);
router.put("/edit/:id", controller.edit);
export default router;
