import { Dependency, Monitor, Incident } from "../models/index.js";

// Given a monitor that's down, find all monitors that depend on it (directly)
export const getAffectedServices = async (monitorId) => {
  const dependentLinks = await Dependency.findAll({
    where: { parentMonitorId: monitorId },
  });

  const childIds = dependentLinks.map((link) => link.childMonitorId);
  if (childIds.length === 0) return [];

  const affectedMonitors = await Monitor.findAll({
    where: { id: childIds },
  });

  return affectedMonitors;
};

// For every monitor with an ongoing incident, list what depends on it
export const getTopologyStatus = async () => {
  const ongoingIncidents = await Incident.findAll({
    where: { status: "ONGOING" },
    include: [{ model: Monitor }],
  });

  const topology = [];

  for (const incident of ongoingIncidents) {
    const affected = await getAffectedServices(incident.monitorId);
    topology.push({
      downMonitor: {
        id: incident.Monitor.id,
        name: incident.Monitor.name,
        target: incident.Monitor.target,
      },
      failureType: incident.failureType,
      startedAt: incident.startedAt,
      potentiallyAffected: affected.map((m) => ({
        id: m.id,
        name: m.name,
        target: m.target,
      })),
    });
  }

  return topology;
};