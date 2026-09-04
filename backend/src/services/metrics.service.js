import { CheckResult } from "../models/index.js";
import { sequelize } from "../config/db.js";
import { checkQueue } from "../queues/check.queue.js";


export const getMonitorMetrics = async (monitorId) => {
  const results = await CheckResult.findAll({
    where: { monitorId },
    attributes: ["status", "responseTimeMs"],
    order: [["checkedAt", "DESC"]],
    limit: 1000, // look at last 1000 checks, avoid scanning entire history
  });

  const totalChecks = results.length;
  if (totalChecks === 0) {
    return {
      totalChecks: 0,
      uptimePercent: null,
      avgResponseTimeMs: null,
      p95ResponseTimeMs: null,
    };
  }

  const successCount = results.filter((r) => r.status === "SUCCESS").length;
  const uptimePercent = ((successCount / totalChecks) * 100).toFixed(2);

  // Sort response times ascending for percentile calculation
  const responseTimes = results
    .map((r) => r.responseTimeMs)
    .filter((t) => t !== null)
    .sort((a, b) => a - b);

  const avgResponseTimeMs =
    responseTimes.length > 0
      ? Math.round(responseTimes.reduce((sum, t) => sum + t, 0) / responseTimes.length)
      : null;

  const p95Index = Math.floor(responseTimes.length * 0.95);
  const p95ResponseTimeMs = responseTimes[p95Index] ?? responseTimes[responseTimes.length - 1] ?? null;

  return {
    totalChecks,
    successCount,
    failureCount: totalChecks - successCount,
    uptimePercent: Number(uptimePercent),
    avgResponseTimeMs,
    p95ResponseTimeMs,
  };
};


export const getQueueMetrics = async () => {
  const counts = await checkQueue.getJobCounts("completed", "failed", "active", "waiting", "delayed");

  // Sample last 20 completed jobs to estimate queue latency
  const completedJobs = await checkQueue.getJobs(["completed"], 0, 20);

  const latencies = completedJobs
    .filter((job) => job.processedOn && job.timestamp)
    .map((job) => job.processedOn - job.timestamp); // time between job added & picked up

  const avgQueueLatencyMs =
    latencies.length > 0
      ? Math.round(latencies.reduce((sum, l) => sum + l, 0) / latencies.length)
      : null;

  return {
    jobCounts: counts,
    avgQueueLatencyMs,
    sampledJobs: latencies.length,
  };
};