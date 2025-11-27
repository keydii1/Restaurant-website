import { Router } from "express";
import * as controller from "../controllers/cart.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as cartValidate from "../validates/cart.validate";
const router = Router();

router.get("/", auth, controller.getCart);
router.post(
  "/add",
  authAdmin,
  cartValidate.dishIdRequired,
  cartValidate.dishExists,
  cartValidate.quantityRequired,
  cartValidate.quantityValid,
  controller.addToCart
);
router.delete("/clear", authAdmin, controller.clearCart);
router.post(
  "/change",
  authAdmin,
  cartValidate.dishIdRequired,
  cartValidate.quantityValid,
  controller.changeOneItemFromCart
);

export default router;
