import express from "express";
import verifyJWT from "../middlewares/verifyJWT.js";
import requireRole from "../middlewares/requireRole.js";
import { createSchedule, getAllSchedules, getAvailableSchedules, getMySchedules, updateSchedule, cancelSchedule, bookSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/", requireRole("admin"), createSchedule);

router.get("/admin", requireRole("admin"), getAllSchedules);

router.get("/available", requireRole("user"), getAvailableSchedules);

router.get("/my", requireRole("user"), getMySchedules);

router.post("/:scheduleId/book", requireRole("user"), bookSchedule);

router.patch("/:scheduleId", requireRole("admin"), updateSchedule);

router.patch("/:scheduleId/cancel", requireRole("admin"), cancelSchedule);

export default router;