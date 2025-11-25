import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as validator from "../validates/user.validate";
const router = Router();
import {
  validateEmail,
  validatePassword,
} from "../validates/EmailAndPassword.validate";
import { authAdmin } from "../auth/checkAuth.auth";
router.get("/", authAdmin, controller.getUsers);
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.patch("/reset-password", controller.resetPassword);
router.get("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.get("/auth/google", controller.googleAuth);
router.get("/auth/google/callback", controller.googleAuthCallback);
export default router;
