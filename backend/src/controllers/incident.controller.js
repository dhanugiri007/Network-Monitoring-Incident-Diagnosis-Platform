import { Incident, Monitor } from "../models/index.js";

export const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.findAll({
      include: [{ model: Monitor, attributes: ["name", "target"] }],
      order: [["startedAt", "DESC"]],
    });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};