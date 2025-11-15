import { Router } from "express";
import * as controller from "../controllers/cart.controller";
import { authUser } from "../auth/checkAuth.auth";
const router = Router();

router.get("/", authUser, controller.getCart);
router.post("/add", authUser, controller.addToCart);
router.post("/clear", authUser, controller.clearCart);
router.post("/change", authUser, controller.changeOneItemFromCart);

export default router;
