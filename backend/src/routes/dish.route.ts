import express, { Express, Request, Response } from "express";
import * as controller from "../controllers/dish.controller";
const router = express.Router();

router.get("/", controller.getDishes);
router.patch("/change-status/:id/:status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteDish);
export default router;
