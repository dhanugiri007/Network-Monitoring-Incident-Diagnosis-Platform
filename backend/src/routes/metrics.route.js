import { Router } from "express";
import { getMetricsForMonitor, getSystemMetrics } from "../controllers/metrics.controller.js";

const router = Router();

router.get("/system", getSystemMetrics);
router.get("/:id", getMetricsForMonitor);

export default router;