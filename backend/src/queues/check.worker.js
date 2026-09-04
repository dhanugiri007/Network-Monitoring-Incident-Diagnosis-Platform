import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { runDiagnosis } from "../services/diagnosis.service.js";
import { CheckResult } from "../models/index.js";

export const checkWorker = new Worker(
  "network-checks",
  async (job) => {
    const { monitorId, target, type, port } = job.data;

    console.log(`Running check for monitor ${monitorId} (${target})`);

    const result = await runDiagnosis({ target, type, port });

    // Save result to MySQL
    await CheckResult.create({
      monitorId,
      status: result.status,
      failureType: result.failureType || null,
      responseTimeMs: result.responseTimeMs,
      httpStatusCode: result.httpStatusCode || null,
      errorMessage: result.errorMessage || null,
    });

    console.log(
      `${result.status === "SUCCESS" ? "✅" : "❌"} Monitor ${monitorId}: ${result.status}${
        result.failureType ? ` (${result.failureType})` : ""
      } — ${result.responseTimeMs}ms`
    );

    return result;
  },
  {
    connection: redisConnection,
    concurrency: 10, // process up to 10 checks in parallel
  }
);

checkWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

checkWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});