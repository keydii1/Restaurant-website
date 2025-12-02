import { Router } from "express";
import * as controller from "../controllers/payment.controller";
import * as paymentValidate from "../validates/payment.validate";

const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.post("/", controller.createPayment);
router.get("/result", controller.changePaymentStatus);
export default router;
