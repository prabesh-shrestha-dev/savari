import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import upload from "../middlewares/upload.js";
import { uploadDocument } from "../controllers/documentController.js";

const router = express.Router();

router.use(verifyJWT, requireRole("user"));

router.post(
  "/upload",
  upload.any(),
  uploadDocument
);

export default router;