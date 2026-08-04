import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import { collectLicneseCard, markBiometricResult, markLicenseCardReady, markPracticalExamResult, markWrittenExamResult } from "../controllers/examinationController.js";

const router = express.Router();

router.use(verifyJWT);

router.patch("/:applicationId/biometric", requireRole("admin"), markBiometricResult);

router.patch("/:applicationId/written", requireRole("admin"), markWrittenExamResult);

router.patch("/:applicationId/practical", requireRole("admin"), markPracticalExamResult);

router.patch("/:applicationId/license-ready", requireRole("admin"), markLicenseCardReady);

router.patch("/:applicationId/license-collected", requireRole("admin"), collectLicneseCard);

export default router;