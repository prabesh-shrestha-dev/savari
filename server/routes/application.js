import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import { createApplication, getPendingApplications, reviewApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", requireRole("user"), createApplication);

router.get("/review", requireRole("admin"), getPendingApplications);

router.patch("/:applicationId/review", requireRole("admin"), reviewApplication);

export default router;