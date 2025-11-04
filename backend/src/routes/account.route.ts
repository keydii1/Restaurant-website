import { Router } from "express";
import * as controller from "../controllers/account.controller";
const router = Router();

router.get("/", controller.getList);
router.post("/", controller.createAccount);

export default router;
