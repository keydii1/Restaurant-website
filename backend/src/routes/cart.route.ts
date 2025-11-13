import { Router } from "express";
import * as controller from "../controllers/cart.controller";

const router = Router();

router.get("/", controller.getCart);

export default router;
