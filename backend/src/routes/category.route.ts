import { Router } from "express";
import * as controller from "../controllers/category.controller";
import * as validator from "../validates/category.validate";
const router = Router();

router.get("/", validator.test, controller.getCategories);
router.post("/create", controller.create);
router.patch("/edit/:id", controller.edit);
router.delete("/delete/:id", controller.Delete);
router.patch("/change-multi", controller.changeMulti);
router.patch("/change-status/:id/:status", controller.changeStatus);
export default router;
