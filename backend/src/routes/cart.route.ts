import { Router } from "express";
import * as controller from "../controllers/cart.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as cartValidate from "../validates/cart.validate";
const router = Router();

router.get("/", auth, controller.getCart);
router.post(
  "/add",
  auth,
  cartValidate.dishIdRequired,
  cartValidate.dishExists,
  cartValidate.quantityRequired,
  cartValidate.quantityValid,
  controller.addToCart
);
router.delete("/clear", auth, controller.clearCart);
router.post(
  "/edit",
  auth,
  cartValidate.dishIdRequired,
  cartValidate.quantityValid,
  controller.changeOneItemFromCart
);
router.delete(
  "/delete-item",
  auth,
  cartValidate.dishIdRequired,
  controller.removeOneItemFromCart
);
export default router;
