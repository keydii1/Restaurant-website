import { Router } from "express";
import * as controller from "../controllers/order.controller";
import { authUser } from "../auth/checkAuth.auth";
const router = Router();

router.get("/", authUser, controller.getOrders);

export default router;
