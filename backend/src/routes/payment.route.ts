import { Router } from "express";
import * as controller from "../controllers/payment.controller";

const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.post("/", authAdmin, controller.createPayment);
export default router;
