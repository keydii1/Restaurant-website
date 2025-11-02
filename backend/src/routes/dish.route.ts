import { Router } from "express";
const router = Router();

import * as controller from "../controllers/dish.controller";
import multer from "multer";
// Use memory storage so `req.file.buffer` is available for stream upload to Cloudinary
const upload = multer({ dest: "uploads/" });
// Cloudinary upload middleware (ES Module import)
import { uploadImage } from "../middlewares/uploadCloud.middleware";
router.get("/", controller.getDishes);
router.patch("/change-status/:id/:status", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteDish);
router.post("/create", upload.single("image"), uploadImage, controller.create);
router.patch("/edit/:id", upload.single("image"), uploadImage, controller.edit);
router.get("/detail/:id", controller.getDishDetail);
export default router;
