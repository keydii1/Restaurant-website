import { Router } from "express";
import * as controllers from "../controllers/table.controller";
import * as tableValidate from "../validates/table.validate";
const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", auth, controllers.getAllTables);
router.get("/available", auth, controllers.getAvailableTables);
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
router.patch("/edit/:id", auth, controllers.editTable);
router.patch("/change-status/:id", authAdmin, controllers.changeTableStatus);
export default router;
