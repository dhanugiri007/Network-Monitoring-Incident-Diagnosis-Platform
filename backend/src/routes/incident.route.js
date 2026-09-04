import { Router } from "express";
import { getIncidents } from "../controllers/incident.controller.js";

const router = Router();

router.get("/", getIncidents);

export default router;