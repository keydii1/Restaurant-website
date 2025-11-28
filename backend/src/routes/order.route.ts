import { Router } from "express";
import * as controller from "../controllers/order.controller";
import { auth } from "../auth/checkAuth.auth";
import * as orderValidate from "../validates/order.validate";
const router = Router();

router.get("/", auth, controller.getOrders);
router.post("/create", auth, controller.createOrder);
router.put("/:id", auth, controller.updateOrder);
router.put("/:id/status", auth, controller.updateOrderStatus);
router.put("/:id/payment", auth, controller.updatePaymentStatus);
export default router;
