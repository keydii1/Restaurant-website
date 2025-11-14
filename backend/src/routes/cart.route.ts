import { Router } from "express";
import * as controller from "../controllers/cart.controller";

const router = Router();

router.get("/", controller.getCart);
router.post("/add", controller.addToCart);
router.post("/clear", controller.clearCart);
router.post("/change", controller.changeOneItemFromCart);

export default router;
