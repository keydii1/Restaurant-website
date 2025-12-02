import { Router } from "express";
const router = Router();
import * as contactValidate from "../validates/contact.validate";
import * as controller from "../controllers/contact.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", authAdmin, controller.getContacts);
router.post(
  "/create",
  contactValidate.nameRequired,
  contactValidate.nameLength,
  contactValidate.emailValid,
  contactValidate.messageRequired,
  contactValidate.messageLength,
  controller.create
);
router.patch(
  "/edit/:id",
  authAdmin,
  contactValidate.nameLength,
  contactValidate.messageLength,
  contactValidate.statusValid,
  controller.edit
);
router.delete("/delete/:id", authAdmin, controller.deleteContact);
export default router;
