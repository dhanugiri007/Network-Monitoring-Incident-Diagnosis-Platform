import { getMonitorMetrics, getQueueMetrics } from "../services/metrics.service.js";
import { Monitor } from "../models/index.js";

export const getMetricsForMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) return res.status(404).json({ error: "Monitor not found" });

    const metrics = await getMonitorMetrics(req.params.id);
    res.json({ monitor: { id: monitor.id, name: monitor.name, target: monitor.target }, metrics });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSystemMetrics = async (req, res) => {
  try {
    const queueMetrics = await getQueueMetrics();
    res.json(queueMetrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};