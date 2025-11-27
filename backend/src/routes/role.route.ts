import { Router } from "express";
const router = Router();
import * as controller from "../controllers/role.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
import * as roleValidate from "../validates/role.validate";
router.get("/", controller.getRoles);
router.post(
  "/create",
  roleValidate.nameRequired,
  roleValidate.nameLength,
  roleValidate.nameUnique,
  roleValidate.descriptionLength,
  roleValidate.permissionsValid,
  controller.createRole
);
router.patch(
  "/edit/:id",
  roleValidate.nameLength,
  roleValidate.nameUnique,
  roleValidate.descriptionLength,
  roleValidate.permissionsValid,
  controller.editRole
);
router.delete("/delete/:id", controller.deleteRole);
export default router;
