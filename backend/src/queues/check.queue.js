import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const checkQueue = new Queue("network-checks", {
  connection: redisConnection,
});

// Add/update a repeatable job scheduler for a monitor
export const scheduleMonitorJob = async (monitor) => {
  const schedulerId = `monitor-${monitor.id}`;

  await checkQueue.upsertJobScheduler(
    schedulerId,
    { every: monitor.intervalSeconds * 1000 }, // repeat pattern
    {
      name: "run-check",
      data: {
        monitorId: monitor.id,
        target: monitor.target,
        type: monitor.type,
        port: monitor.port,
      },
      opts: {
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    }
  );

  console.log(` Scheduled job scheduler for monitor ${monitor.id} every ${monitor.intervalSeconds}s`);
};

// Remove a monitor's job scheduler (used on delete/deactivate)
export const unscheduleMonitorJob = async (monitor) => {
  const schedulerId = `monitor-${monitor.id}`;
  await checkQueue.removeJobScheduler(schedulerId);
  console.log(` Removed job scheduler for monitor ${monitor.id}`);
};