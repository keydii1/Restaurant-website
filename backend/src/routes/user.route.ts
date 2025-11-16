import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as validator from "../validates/user.validate";
const router = Router();
import {
  validateEmail,
  validatePassword,
} from "../validates/EmailAndPassword.validate";

router.get("/", controller.getUsers);
router.post("/register", validateEmail, validatePassword, controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.patch("/reset-password", validatePassword, controller.resetPassword);
router.get("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.get("/auth/google", controller.googleAuth);
router.get("/auth/google/callback", controller.googleAuthCallback);
export default router;
