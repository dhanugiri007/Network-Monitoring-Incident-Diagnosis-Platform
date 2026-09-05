"use client";

import { useMonitorDetail } from "../hooks/useMonitorDetail";

export default function MonitorDetail({ id }) {
  const { monitor, metrics, loading, error, refetch } = useMonitorDetail(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!monitor) return <p>Monitor not found.</p>;

  return (
    <div>
      <a href="/monitors">← Back to Monitors</a>

      <h2>{monitor.name}</h2>
      <p>Target: {monitor.target}</p>
      <p>Type: {monitor.type}</p>
      <p>Interval: {monitor.intervalSeconds}s</p>
      <p>Active: {monitor.isActive ? "Yes" : "No"}</p>

      <button onClick={refetch}>Refresh</button>

      <h3>Metrics</h3>
      {metrics ? (
        <ul>
          <li>Total checks: {metrics.totalChecks}</li>
          <li>Success count: {metrics.successCount}</li>
          <li>Failure count: {metrics.failureCount}</li>
          <li>Uptime %: {metrics.uptimePercent}</li>
          <li>Avg response time: {metrics.avgResponseTimeMs} ms</li>
          <li>P95 response time: {metrics.p95ResponseTimeMs} ms</li>
        </ul>
      ) : (
        <p>No metrics yet.</p>
      )}
    </div>
  );
}