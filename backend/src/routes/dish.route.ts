import { Router } from "express";
const router = Router();
import { uploadImage } from "../middlewares/uploadCloud.middleware";
import { authUser, authAdmin } from "../auth/checkAuth.auth";
import * as controller from "../controllers/dish.controller";
import multer from "multer";
// Use memory storage so `req.file.buffer` is available for stream upload to Cloudinary
const upload = multer({ dest: "uploads/" });
// Cloudinary upload middleware (ES Module import)

router.get("/", authUser, authUser, controller.getDishes);
router.patch("/change-status/:id/:status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteDish);
router.post("/create", upload.single("image"), uploadImage, controller.create);
router.get("/create", (req, res) => {
  res.render("product/upload_test.pug");
});
router.patch("/edit/:id", upload.single("image"), uploadImage, controller.edit);
router.get("/detail/:id", controller.getDishDetail);
export default router;
