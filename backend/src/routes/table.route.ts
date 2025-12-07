import { Router } from "express";
import * as controllers from "../controllers/table.controller";
import * as tableValidate from "../validates/table.validate";
const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", auth, controllers.getAllTables);
router.post(
  "/create",
  authAdmin,
  tableValidate.tableNumberRequired,
  tableValidate.tableNumberValid,
  tableValidate.tableNumberUnique,
  tableValidate.maximumCapacityRequired,
  tableValidate.maximumCapacityValid,
  tableValidate.statusValid,
  tableValidate.positionRequired,
  tableValidate.positionLength,
  controllers.createTable
);
router.delete("/delete/:id", authAdmin, controllers.deleteTable);
router.patch(
  "/edit/:id",
  auth,
  tableValidate.tableNumberValid,
  tableValidate.maximumCapacityValid,
  tableValidate.statusValid,
  tableValidate.positionLength,
  controllers.editTable
);
router.patch(
  "/change-status/:id",
  authAdmin,
  tableValidate.statusValid,
  controllers.changeTableStatus
);
export default router;
