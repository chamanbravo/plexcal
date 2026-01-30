import { Router } from "express";
import {
  createClassSchedules,
  deleteClassSchedule,
  getClassSchedules,
  updateClassSchedule,
} from "../controllers/classScheduleController";
import { zodParser } from "../middleware/zodParser";
import { createClassScheduleSchema } from "../zodSchema/classScheduleSchema";

const router = Router();

router.post("/", zodParser(createClassScheduleSchema), createClassSchedules);
router.get("/", getClassSchedules);
router.patch("/:id", updateClassSchedule);
router.delete("/:id", deleteClassSchedule);

export default router;
