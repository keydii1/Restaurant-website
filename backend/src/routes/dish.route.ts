import { Router } from "express";
const router = Router();
import { uploadImage } from "../middlewares/uploadCloud.middleware";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as controller from "../controllers/dish.controller";
import * as dishValidate from "../validates/dish.validate";
import multer from "multer";

// Configure multer with file size limit (50MB)
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB in bytes
    fieldSize: 50 * 1024 * 1024, // 50MB for text fields
  },
});

//restaurant/api/v1/dishes
router.get("/", controller.getDishes);
router.patch("/change-status/:id/:status", authAdmin, controller.changeStatus);
router.patch("/change-multi", authAdmin, controller.changeMulti);
router.delete("/delete/:id", authAdmin, controller.deleteDish);
router.get("/search", controller.getSearchedDish);
router.post(
  "/create",
  authAdmin,
  upload.single("image"),
  uploadImage,
  dishValidate.nameNotEmpty,
  dishValidate.nameNotMoreThan100Chars,
  dishValidate.categoryExistCheck,
  dishValidate.priceValid,
  dishValidate.discountValid,
  dishValidate.ratingValid,
  dishValidate.prepareTimeValid,
  dishValidate.descriptionValid,
  controller.create
);
router.get("/all", controller.getAllDishes);
router.patch(
  "/edit/:id",
  authAdmin,
  upload.single("image"),
  uploadImage,
  dishValidate.nameNotMoreThan100Chars,
  dishValidate.priceValid,
  dishValidate.discountValid,
  dishValidate.ratingValid,
  dishValidate.prepareTimeValid,
  dishValidate.descriptionValid,
  controller.edit
);
router.get("/detail/:id", auth, controller.getDishDetail);
export default router;
