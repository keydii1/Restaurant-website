import { Router } from "express";
const router = Router();
import * as controller from "../controllers/contact.controller";
import { auth, authAdmin } from "../auth/checkAuth.auth";
router.get("/", authAdmin, controller.getContacts);
router.post("/create", auth, controller.create);
router.patch("/edit/:id", auth, controller.edit);
router.delete("/delete", auth, controller.deleteContact);
export default router;
