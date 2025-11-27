import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as userValidate from "../validates/user.validate";
const router = Router();
import {
  validateEmail,
  validatePassword,
} from "../validates/EmailAndPassword.validate";
import { authAdmin } from "../auth/checkAuth.auth";
router.get("/", authAdmin, controller.getUsers);
router.post(
  "/register",
  userValidate.usernameNotEmpty,
  validateEmail,
  userValidate.emailValid,
  userValidate.emailExistCheck,
  validatePassword,
  userValidate.passwordRequirements,
  controller.register
);
router.post("/login", validateEmail, userValidate.emailValid, controller.login);
router.post(
  "/forgot-password",
  validateEmail,
  userValidate.emailValid,
  controller.forgotPassword
);
router.post("/verify-otp", controller.verifyOtp);
router.patch(
  "/reset-password",
  validatePassword,
  userValidate.passwordRequirements,
  controller.resetPassword
);
router.get("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.get("/auth/google", controller.googleAuth);
router.get("/auth/google/callback", controller.googleAuthCallback);
export default router;
