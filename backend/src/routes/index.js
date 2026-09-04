import { Router } from "express";
import monitorRoutes from "./monitor.route.js";

const router = Router();

router.use("/monitors", monitorRoutes);

export default router;