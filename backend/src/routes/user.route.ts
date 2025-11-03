import { Router } from "express";
import * as controller from "../controllers/user.controller";
import * as validator from "../validates/user.validate";
const router = Router();

router.get("/", controller.getUsers);
router.post(
  "/",
  validator.usernameNotEmpty,
  validator.passwordRequirements,
  validator.emailValid,
  validator.emailExistCheck,
  validator.roleValid,
  controller.createUser
);

export default router;
