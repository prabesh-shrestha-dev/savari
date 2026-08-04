import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import { getMyLicense } from "../controllers/licenseController.js";

const router = express.Router();

router.use(verifyJWT);

router.get(
  "/my",
  requireRole("user"),
  getMyLicense
);

export default router;