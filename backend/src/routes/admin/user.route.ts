import { Router } from "express";
const router = Router();
import dotenv from "dotenv";
dotenv.config();
import * as controller from "../../controllers/admin/user.controller";
router.get("/register", controller.register);

export default router;
