import { Router } from "express";
import monitorRoutes from "./monitor.route.js";
import incidentRoutes from "./incident.route.js"; 
import metricsRoutes from "./metrics.route.js";
import dependencyRoutes from "./dependency.route.js";

const router = Router();

router.use("/monitors", monitorRoutes);
router.use("/incidents", incidentRoutes); 
router.use("/metrics", metricsRoutes);
router.use("/dependencies", dependencyRoutes);

export default router;