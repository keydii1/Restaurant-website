import express, { Express, Router } from "express";
import * as controller from "../../controllers/client/home.controller";
const router = express.Router();
router.get("/", controller.index);
// Export router
export default router;
