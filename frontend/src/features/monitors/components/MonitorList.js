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

  const activeCount = monitors.filter((m) => m.isActive).length;
  const typeCounts = monitors.reduce((acc, m) => {
    acc[m.type] = (acc[m.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h1>MONITORS</h1>

      <div className="stats-bar">
        <div className="stat-box">
          <span className="stat-number">{monitors.length}</span>
          <span className="stat-label">TOTAL MONITORS</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--green)" }}>{activeCount}</span>
          <span className="stat-label">ACTIVE</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--cyan)" }}>{typeCounts.HTTP || 0}</span>
          <span className="stat-label">HTTP CHECKS</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--pink)" }}>{monitors.length - activeCount}</span>
          <span className="stat-label">PAUSED</span>
        </div>
      </div>

      <div className="panel">
        <MonitorForm onCreated={refetch} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>ALL MONITORS</h2>
        <button className="btn" onClick={refetch}>REFRESH</button>
      </div>

      {loading && <p>Loading monitors...</p>}
      {error && <p className="error-text">Error: {error}</p>}
      {!loading && monitors.length === 0 && <p>No monitors yet.</p>}

      <div className="card-grid">
        {monitors.map((monitor) => (
          <div key={monitor.id} className={`card ${monitor.isActive ? "is-up" : ""}`}>
            <div className="card-header">
              <span className="card-title">{monitor.name}</span>
              <span className={`tag tag-${monitor.type.toLowerCase()}`}>{monitor.type}</span>
            </div>

            <div className="card-meta">{monitor.target}</div>

            <div>
              <span className={`status-dot ${monitor.isActive ? "success" : "fail"}`}></span>
              {monitor.isActive ? "Active" : "Paused"} · every {monitor.intervalSeconds}s
            </div>

            <div className="card-footer">
              <a href={`/monitors/${monitor.id}`}>VIEW DETAILS →</a>
              <button className="btn btn-danger" onClick={() => handleDelete(monitor.id)}>
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}