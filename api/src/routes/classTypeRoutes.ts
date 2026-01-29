import { Router } from "express";
import { getClassTypes } from "../controllers/classTypeController";

const router = Router();

router.get("/", getClassTypes);

export default router;
