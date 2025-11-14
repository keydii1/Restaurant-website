import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as validator from "../validates/user.validate";
const router = Router();

router.get("/", controller.getUsers);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.patch("/reset-password", controller.resetPassword);
export default router;
