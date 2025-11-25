import { Router } from "express";
import { uploadImage } from "../middlewares/uploadCloud.middleware";
import multer from "multer";
// Use memory storage so `req.file.buffer` is available for stream upload to Cloudinary
const upload = multer({ dest: "uploads/" });
import * as controller from "../controllers/blog.controller";
import { authAdmin, auth } from "../auth/checkAuth.auth";
const router = Router();
router.get("/", auth, auth, controller.getBlogs);
router.post(
  "/create",
  authAdmin,
  upload.single("image"),
  uploadImage,
  controller.create
);
router.patch(
  "/edit/:id",
  authAdmin,
  upload.single("image"),
  uploadImage,
  controller.edit
);
router.delete("/delete/:id", authAdmin, controller.DeleteBlog);
export default router;
