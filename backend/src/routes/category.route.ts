import { Router } from "express";
import * as controller from "../controllers/category.controller";
import * as validator from "../validates/EmailAndPassword.validate";
const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
import { uploadImage } from "../middlewares/uploadCloud.middleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

router.get("/", auth, controller.getCategories);
router.post(
  "/create",
  upload.single("images"),
  uploadImage,
  authAdmin,
  controller.create
);
router.patch(
  "/edit/:id",
  upload.single("images"),
  uploadImage,
  authAdmin,
  controller.edit
);
router.delete("/delete/:id", authAdmin, controller.Delete);
router.patch("/change-multi", authAdmin, controller.changeMulti);
router.patch("/change-status/:id/:status", authAdmin, controller.changeStatus);
export default router;
