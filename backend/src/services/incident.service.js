import { Incident, CheckResult } from "../models/index.js";
import { Op } from "sequelize";

const FAILURE_THRESHOLD = 3; // consecutive failures before opening an incident

export const evaluateIncident = async (monitorId, currentResult) => {
  // Get the most recent N results for this monitor, newest first
  const recentResults = await CheckResult.findAll({
    where: { monitorId },
    order: [["checkedAt", "DESC"]],
    limit: FAILURE_THRESHOLD,
  });

  const existingIncident = await Incident.findOne({
    where: { monitorId, status: "ONGOING" },
  });

  if (currentResult.status === "FAILURE") {
    // Check if last N results (including current) are ALL failures
    const allFailed =
      recentResults.length === FAILURE_THRESHOLD &&
      recentResults.every((r) => r.status === "FAILURE");

    if (allFailed && !existingIncident) {
      // Open a new incident
      const incident = await Incident.create({
        monitorId,
        status: "ONGOING",
        failureType: currentResult.failureType,
        startedAt: new Date(),
      });
      console.log(`Incident opened for monitor ${monitorId} (${currentResult.failureType})`);
      return incident;
    }

    // Already ongoing — nothing new to do, it's still down
    return existingIncident;
  }

  // Current check SUCCEEDED
  if (currentResult.status === "SUCCESS" && existingIncident) {
    const resolvedAt = new Date();
    const downtimeSeconds = Math.round(
      (resolvedAt.getTime() - new Date(existingIncident.startedAt).getTime()) / 1000
    );

    await existingIncident.update({
      status: "RESOLVED",
      resolvedAt,
      downtimeSeconds,
    });

    console.log(`Incident resolved for monitor ${monitorId} — downtime: ${downtimeSeconds}s`);
    return existingIncident;
  }

  return null; // no incident activity
};