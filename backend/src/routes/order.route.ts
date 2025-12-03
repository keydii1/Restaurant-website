import { Router } from "express";
import * as controller from "../controllers/order.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as orderValidate from "../validates/order.validate";
const router = Router();

router.get("/", authAdmin, controller.getAllOrders);
router.get("/my-orders", auth, controller.getOrders);
router.get("/detail/:id", authAdmin, controller.GetOrderDetail);
router.post("/create", auth, controller.createOrder);
router.patch("/edit/:id", auth, controller.updateOrder);
router.patch("/edit/:id/status", authAdmin, controller.updateOrderStatus);
router.patch("/edit/:id/payment", authAdmin, controller.updatePaymentStatus);
router.post("/create-payment", controller.createPayment);
router.get("/result", controller.successfulPayment);
export default router;
