import { Router } from "express";
import * as controller from "../controllers/cart.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
const router = Router();

router.get("/", auth, controller.getCart);
router.post("/add", authAdmin, controller.addToCart);
router.delete("/clear", authAdmin, controller.clearCart);
router.post("/change", authAdmin, controller.changeOneItemFromCart);

export default router;
