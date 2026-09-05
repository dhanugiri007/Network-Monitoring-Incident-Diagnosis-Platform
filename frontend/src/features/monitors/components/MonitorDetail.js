"use client";

import { useMonitorDetail } from "../hooks/useMonitorDetail";

export default function MonitorDetail({ id }) {
  const { monitor, metrics, loading, error, refetch } = useMonitorDetail(id);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;
  if (!monitor) return <p>Monitor not found.</p>;

  return (
    <div>
      <a href="/monitors">← BACK TO MONITORS</a>

      <h1>{monitor.name}</h1>

      <div className="panel">
        <p>Target: {monitor.target}</p>
        <p>Type: {monitor.type}</p>
        <p>Interval: {monitor.intervalSeconds}s</p>
        <p>
          <span className={`status-dot ${monitor.isActive ? "success" : "fail"}`}></span>
          Active: {monitor.isActive ? "Yes" : "No"}
        </p>
        <button className="btn" onClick={refetch}>REFRESH</button>
      </div>

      <h2>METRICS</h2>
      {metrics ? (
        <ul className="pixel-list">
          <li>Total checks: {metrics.totalChecks}</li>
          <li><span className="status-dot success"></span>Success count: {metrics.successCount}</li>
          <li><span className="status-dot fail"></span>Failure count: {metrics.failureCount}</li>
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