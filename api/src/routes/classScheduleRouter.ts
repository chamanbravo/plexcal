import { Router } from "express";
import {
  createClassSchedules,
  getClassSchedules,
} from "../controllers/classScheduleController";
import { zodParser } from "../middleware/zodParser";
import { createClassScheduleSchema } from "../zodSchema/classScheduleSchema";

const router = Router();

router.post("/", zodParser(createClassScheduleSchema), createClassSchedules);
router.get("/", getClassSchedules);

export default router;
