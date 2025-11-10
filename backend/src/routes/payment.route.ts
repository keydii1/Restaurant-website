import { Router } from "express";
import * as controller from "../controllers/payment.controller";

const router = Router();

router.post("/", controller.createPayment);
export default router;
