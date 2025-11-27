import { Router } from "express";
import * as controller from "../controllers/order.controller";
import { auth } from "../auth/checkAuth.auth";
import * as orderValidate from "../validates/order.validate";
const router = Router();

router.get("/", auth, controller.getOrders);

export default router;
