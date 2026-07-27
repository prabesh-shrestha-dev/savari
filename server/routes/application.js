import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import { createApplication } from "../controllers/applicationController.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", requireRole("user"), createApplication);

export default router;