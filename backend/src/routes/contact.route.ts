import { Router } from "express";
const router = Router();
import { validateEmail } from "../validates/EmailAndPassword.validate";
import * as contactValidate from "../validates/contact.validate";
import * as controller from "../controllers/contact.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", authAdmin, controller.getContacts);
router.post(
  "/create",
  auth,
  contactValidate.nameRequired,
  contactValidate.nameLength,
  validateEmail,
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
router.delete("/delete", authAdmin, controller.deleteContact);
export default router;
