import { Dependency, Monitor } from "../models/index.js";

// Create a dependency link: childMonitor depends on parentMonitor
export const createDependency = async (req, res) => {
  try {
    const { parentMonitorId, childMonitorId } = req.body;

    if (!parentMonitorId || !childMonitorId) {
      return res.status(400).json({ error: "parentMonitorId and childMonitorId are required" });
    }

    if (parentMonitorId === childMonitorId) {
      return res.status(400).json({ error: "A monitor cannot depend on itself" });
    }

    const dependency = await Dependency.create({ parentMonitorId, childMonitorId });
    res.status(201).json(dependency);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// List all dependencies
export const getDependencies = async (req, res) => {
  try {
    const dependencies = await Dependency.findAll();
    res.json(dependencies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a dependency link
export const deleteDependency = async (req, res) => {
  try {
    const dependency = await Dependency.findByPk(req.params.id);
    if (!dependency) return res.status(404).json({ error: "Dependency not found" });

    await dependency.destroy();
    res.json({ message: "Dependency removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};