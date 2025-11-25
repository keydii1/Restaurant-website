import { Router } from "express";
import * as controllers from "../controllers/table.controller";
const router = Router();
import { auth, authAdmin } from "../auth/checkAuth.auth";
``;
router.get("/", auth, controllers.getAllTables);
router.post("/create", authAdmin, controllers.createTable);
router.delete("/delete/:id", authAdmin, controllers.deleteTable);
router.patch("/edit/:id", authAdmin, controllers.editTable);
router.patch(
  "/change-status/:id/:status",
  authAdmin,
  controllers.changeTableStatus
);
export default router;
