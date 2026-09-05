import { Router } from "express";
import {
  createDependency,
  getDependencies,
  deleteDependency,
} from "../controllers/dependency.controller.js";
import { getTopologyStatus } from "../services/topology.service.js";

const router = Router();

router.post("/", createDependency);
router.get("/", getDependencies);
router.delete("/:id", deleteDependency);

router.get("/topology/status", async (req, res) => {
  try {
    const topology = await getTopologyStatus();
    res.json(topology);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;