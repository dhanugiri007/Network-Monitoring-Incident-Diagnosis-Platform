import { Router } from "express";
import {
  createMonitor,
  getMonitors,
  getMonitorById,
  updateMonitor,
  deleteMonitor,
} from "../controllers/monitor.controller.js";

const router = Router();

router.post("/", createMonitor);
router.get("/", getMonitors);
router.get("/:id", getMonitorById);
router.put("/:id", updateMonitor);
router.delete("/:id", deleteMonitor);

export default router;