import { Monitor } from "../models/index.js";
import { scheduleMonitorJob,unscheduleMonitorJob } from "../queues/check.queue.js";
// CREATE
export const createMonitor = async (req, res) => {
  try {
    const { name, target, type, port, intervalSeconds } = req.body;

    if (!name || !target || !type) {
      return res.status(400).json({ error: "name, target and type are required" });
    }

    const monitor = await Monitor.create({
      name,
      target,
      type,
      port,
      intervalSeconds,
    });

    await scheduleMonitorJob(monitor);

    res.status(201).json(monitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
export const getMonitors = async (req, res) => {
  try {
    const monitors = await Monitor.findAll({ order: [["createdAt", "DESC"]] });
    res.json(monitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
export const getMonitorById = async (req, res) => {
  try {
    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) return res.status(404).json({ error: "Monitor not found" });
    res.json(monitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) return res.status(404).json({ error: "Monitor not found" });

    await unscheduleMonitorJob(monitor);
    await monitor.update(req.body);
    await scheduleMonitorJob(monitor);

    res.json(monitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteMonitor = async (req, res) => {
  try {
    const monitor = await Monitor.findByPk(req.params.id);
    if (!monitor) return res.status(404).json({ error: "Monitor not found" });

    await unscheduleMonitorJob(monitor);
    await monitor.destroy();
    
    res.json({ message: "Monitor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};