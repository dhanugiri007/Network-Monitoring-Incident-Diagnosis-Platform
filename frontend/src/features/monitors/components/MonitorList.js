"use client";

import { useMonitors } from "../hooks/useMonitors";

export default function MonitorList() {
  const { monitors, loading, error, refetch } = useMonitors();

  if (loading) return <p>Loading monitors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Monitors</h2>
      <button onClick={refetch}>Refresh</button>

      {monitors.length === 0 && <p>No monitors yet.</p>}

      <ul>
        {monitors.map((monitor) => (
          <li key={monitor.id}>
            <strong>{monitor.name}</strong> — {monitor.target} ({monitor.type})
            <br />
            Interval: {monitor.intervalSeconds}s | Active: {monitor.isActive ? "Yes" : "No"}
          </li>
        ))}
      </ul>
    </div>
  );
}