import { Router } from "express";
import monitorRoutes from "./monitor.route.js";
import incidentRoutes from "./incident.route.js"; 

const router = Router();

router.use("/monitors", monitorRoutes);
router.use("/incidents", incidentRoutes); 

export default router;