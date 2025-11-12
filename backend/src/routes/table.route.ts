import { Router } from "express";
import * as controllers from "../controllers/table.controller";
const router = Router();

router.get("/", controllers.getAllTables);
router.post("/create", controllers.createTable);
router.delete("/delete/:id", controllers.deleteTable);
router.patch("/edit/:id", controllers.editTable);
export default router;
