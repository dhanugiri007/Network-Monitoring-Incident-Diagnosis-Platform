"use client";

import { useMonitors } from "../hooks/useMonitors";
import MonitorForm from "./MonitorForm";
import { monitorApi } from "../services/monitor.api";

export default function MonitorList() {
  const { monitors, loading, error, refetch } = useMonitors();

  const handleDelete = async (id) => {
    if (!confirm("Delete this monitor?")) return;
    await monitorApi.delete(id);
    refetch();
  };

  return (
    <div>
      <h2>Monitors</h2>

      <MonitorForm onCreated={refetch} />

      <hr />

      <button onClick={refetch}>Refresh</button>

      {loading && <p>Loading monitors...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && monitors.length === 0 && <p>No monitors yet.</p>}

      <ul>
        {monitors.map((monitor) => (
          <li key={monitor.id}>
            <strong>{monitor.name}</strong> — {monitor.target} ({monitor.type})
            <br />
            Interval: {monitor.intervalSeconds}s | Active: {monitor.isActive ? "Yes" : "No"}
            <br />
            <a href={`/monitors/${monitor.id}`}>View Details</a>
            {" | "}
            <button onClick={() => handleDelete(monitor.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}