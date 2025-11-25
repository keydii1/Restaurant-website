import { Router } from "express";
const router = Router();
import {
  validateEmail,
  validatePassword,
} from "../validates/EmailAndPassword.validate";
import * as controller from "../controllers/contact.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", authAdmin, controller.getContacts);
router.post("/create", auth, validateEmail, controller.create);
router.patch("/edit/:id", authAdmin, controller.edit);
router.delete("/delete", authAdmin, controller.deleteContact);
export default router;
