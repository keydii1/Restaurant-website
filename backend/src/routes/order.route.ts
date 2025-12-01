import { Router } from "express";
import * as controller from "../controllers/order.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as orderValidate from "../validates/order.validate";
const router = Router();

router.get("/", authAdmin, controller.getAllOrders);
router.get("/my-orders", auth, controller.getOrders);
router.get("/:id", authAdmin, controller.GetOrderDetail);
router.post("/create", auth, controller.createOrder);
router.put("/:id", auth, controller.updateOrder);
router.put("/:id/status", authAdmin, controller.updateOrderStatus);
router.put("/:id/payment", authAdmin, controller.updatePaymentStatus);
export default router;
