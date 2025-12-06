import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as userValidate from "../validates/user.validate";
const router = Router();
import { authAdmin, auth } from "../auth/checkAuth.auth";
import { uploadImage } from "../middlewares/uploadCloud.middleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
router.get("/", authAdmin, controller.getUsers);
router.post(
  "/register",
  upload.single("avatar"),
  uploadImage,
  userValidate.usernameNotEmpty,
  userValidate.emailValid,
  userValidate.emailExistCheck,
  userValidate.usernameExistCheck,
  userValidate.phoneExistCheck,
  userValidate.passwordRequirements,
  controller.register
);
router.post("/login", userValidate.emailValid, controller.login);
router.post(
  "/forgot-password",
  userValidate.emailValid,
  controller.forgotPassword
);
router.get("/profile", auth, controller.getProfile);
router.patch("/edit-profile", auth, controller.editProfile);

router.post("/verify-otp", controller.verifyOtp);
router.patch(
  "/reset-password",
  userValidate.passwordRequirements,
  controller.resetPassword
);
router.get("/logout", controller.logout);
router.post("/refresh-token", controller.refreshToken);
router.get("/auth/google", controller.googleAuth);
router.get("/auth/google/callback", controller.googleAuthCallback);
export default router;
