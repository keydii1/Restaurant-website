import { Router } from "express";
import * as controllers from "../controllers/discount.controller";
const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", auth, controllers.getAllDiscounts);
router.post("/create", authAdmin, controllers.createDiscount);
router.delete("/delete/:id", authAdmin, controllers.deleteDiscount);
router.patch("/edit/:id", authAdmin, controllers.editDiscount);
export default router;
