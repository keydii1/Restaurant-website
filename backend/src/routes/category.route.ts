import { changeMulti } from "./../controllers/dish.controller";
import express, { Router } from "express";
import * as controller from "../controllers/category.controller";
const router = Router();

router.get("/", controller.getCategories);
router.post("/create", controller.create);
router.patch("/edit/:id", controller.edit);
router.delete("/delete/:id", controller.Delete);
router.patch("/change-multi", controller.changeMulti);
router.patch("/change-status/:id/:status", controller.changeStatus);
export default router;
