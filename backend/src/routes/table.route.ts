import { Router } from "express";
import * as controllers from "../controllers/table.controller";
const router = Router();

router.get("/", controllers.getAllTables);
router.post("/create", controllers.createTable);
export default router;
