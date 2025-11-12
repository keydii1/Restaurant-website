import { Router } from "express";
import * as controllers from "../controllers/discount.controller";
const router = Router();

router.get("/", controllers.getAllDiscounts);
router.post("/create", controllers.createDiscount);
router.delete("/delete/:id", controllers.deleteDiscount);
router.patch("/edit/:id", controllers.editDiscount);

export default router;
