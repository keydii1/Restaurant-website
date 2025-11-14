import { Router } from "express";
import * as controller from "../controllers/cart.controller";
import { authUser } from "../auth/checkAuth.auth";
const router = Router();

router.get("/", authUser, controller.getCart);
router.post("/add", controller.addToCart);
router.post("/clear", controller.clearCart);
router.post("/change", controller.changeOneItemFromCart);

export default router;
