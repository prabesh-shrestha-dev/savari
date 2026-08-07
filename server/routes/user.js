import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/me", getCurrentUser);

export default router;