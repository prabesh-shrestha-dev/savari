import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import upload from "../middlewares/upload.js";
import { getAllDocuments, getMyDocuments, updateDocumentStatus, uploadDocument } from "../controllers/documentController.js";

const router = express.Router();

router.use(verifyJWT);

router.post(
  "/upload",
  requireRole("user"),
  upload.any(),
  uploadDocument
);

router.get(
  "/me",
  requireRole("user"),
  getMyDocuments
);

router.get(
  "/admin",
  requireRole("admin"),
  getAllDocuments
);

router.patch(
  "/admin/:userId/:documentType",
  requireRole("admin"),
  updateDocumentStatus
);

export default router;