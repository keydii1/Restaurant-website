import { Router } from "express";
const router = Router();
import { uploadImage } from "../middlewares/uploadCloud.middleware";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as controller from "../controllers/dish.controller";
import multer from "multer";
// Use memory storage so `req.file.buffer` is available for stream upload to Cloudinary
const upload = multer({ dest: "uploads/" });
// Cloudinary upload middleware (ES Module import)

router.get("/", auth, controller.getDishes);
router.patch("/change-status/:id/:status", authAdmin, controller.changeStatus);
router.patch("/change-multi", authAdmin, controller.changeMulti);
router.delete("/delete/:id", authAdmin, controller.deleteDish);
router.post(
  "/create",
  upload.single("image"),
  uploadImage,
  authAdmin,
  controller.create
);
router.get("/create", (req, res) => {
  res.render("product/upload_test.pug");
});

router.patch(
  "/edit/:id",
  upload.single("image"),
  uploadImage,
  authAdmin,
  controller.edit
);
router.get("/detail/:id", auth, controller.getDishDetail);
export default router;
