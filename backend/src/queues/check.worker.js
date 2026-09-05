import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { runDiagnosis } from "../services/diagnosis.service.js";
import { CheckResult } from "../models/index.js";
import { evaluateIncident } from "../services/incident.service.js";

export const checkWorker = new Worker(
  "network-checks",
  async (job) => {
    const { monitorId, target, type, port } = job.data;

    console.log(`Running check for monitor ${monitorId} (${target})`);

    const diagnosisResult = await runDiagnosis({ target, type, port });

    const checkResult = await CheckResult.create({
      monitorId,
      status: diagnosisResult.status,
      failureType: diagnosisResult.failureType || null,
      responseTimeMs: diagnosisResult.responseTimeMs,
      httpStatusCode: diagnosisResult.httpStatusCode || null,
      errorMessage: diagnosisResult.errorMessage || null,
    });

    console.log(
      `Monitor ${monitorId}: ${diagnosisResult.status}${
        diagnosisResult.failureType ? ` (${diagnosisResult.failureType})` : ""
      } — ${diagnosisResult.responseTimeMs}ms`
    );

    await evaluateIncident(monitorId, checkResult);

    return diagnosisResult;
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

checkWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

checkWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});