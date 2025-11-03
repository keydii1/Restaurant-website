import { Router } from "express";
const router = Router();
import * as controller from "../controllers/role.controller";

router.get("/", controller.getRoles);
router.post("/create", controller.createRole);
router.patch("/edit/:id", controller.editRole);
router.delete("/delete/:id", controller.deleteRole);
export default router;
