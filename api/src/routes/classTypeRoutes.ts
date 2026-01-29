import { Router } from "express";
import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controllers/classTypeController";
import { zodParser } from "../middleware/zodParser";
import { createClassTypeSchema } from "../zodSchema/classTypeSchema";

const router = Router();

router.get("/", getAll);
router.post("/", zodParser(createClassTypeSchema), create);
router.get("/:id", getById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
