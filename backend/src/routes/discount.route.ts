import { Router } from "express";
import * as controllers from "../controllers/discount.controller";
import * as discountValidate from "../validates/discount.validate";
const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", auth, controllers.getCurrentDiscounts);
router.get("/all", authAdmin, controllers.getAllDiscounts);
router.post(
  "/create",
  authAdmin,
  discountValidate.codeRequired,
  discountValidate.codeLength,
  discountValidate.codeUnique,
  discountValidate.percentageRequired,
  discountValidate.percentageValid,
  discountValidate.dateRequired,
  discountValidate.dateValid,
  controllers.createDiscount
);
router.delete("/delete/:id", authAdmin, controllers.deleteDiscount);
router.patch(
  "/edit/:id",
  authAdmin,
  discountValidate.codeLength,
  discountValidate.percentageValid,
  discountValidate.dateValid,
  controllers.editDiscount
);
export default router;
