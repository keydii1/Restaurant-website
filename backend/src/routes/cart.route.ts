import { Router } from "express";
import * as controller from "../controllers/cart.controller";
import { auth } from "../auth/checkAuth.auth";
const router = Router();

router.get("/", auth, controller.getCart);
router.post("/add", auth, controller.addToCart);
router.delete("/clear", auth, controller.clearCart);
router.post("/change", auth, controller.changeOneItemFromCart);

export default router;
