import { Router } from "express";
import monitorRoutes from "./monitor.route.js";
import incidentRoutes from "./incident.route.js"; 
import metricsRoutes from "./metrics.route.js";

const router = Router();

router.use("/monitors", monitorRoutes);
router.use("/incidents", incidentRoutes); 
router.use("/metrics", metricsRoutes);

export default router;