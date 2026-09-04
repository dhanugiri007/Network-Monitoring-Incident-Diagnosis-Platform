import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const checkQueue = new Queue("network-checks", {
  connection: redisConnection,
});

// Add/update a repeatable job for a monitor
export const scheduleMonitorJob = async (monitor) => {
  // jobId ties this repeatable schedule to this specific monitor
  const jobId = `monitor-${monitor.id}`;

  await checkQueue.add(
    "run-check",
    {
      monitorId: monitor.id,
      target: monitor.target,
      type: monitor.type,
      port: monitor.port,
    },
    {
      jobId,
      repeat: {
        every: monitor.intervalSeconds * 1000, // ms
      },
      removeOnComplete: 100, // keep last 100 completed jobs, discard rest
      removeOnFail: 100,
    }
  );

  console.log(`Scheduled repeatable job for monitor ${monitor.id} every ${monitor.intervalSeconds}s`);
};

// Remove a monitor's repeatable job (used on delete/deactivate)
export const unscheduleMonitorJob = async (monitor) => {
  const repeatableJobs = await checkQueue.getRepeatableJobs();
  const job = repeatableJobs.find((j) => j.id === `monitor-${monitor.id}`);

  if (job) {
    await checkQueue.removeRepeatableByKey(job.key);
    console.log(`Removed repeatable job for monitor ${monitor.id}`);
  }
};