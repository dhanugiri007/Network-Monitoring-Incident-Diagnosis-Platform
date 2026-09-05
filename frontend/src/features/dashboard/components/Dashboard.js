"use client";

import { useDashboard } from "../hooks/useDashboard";

export default function Dashboard() {
  const { monitors, incidents, topologyStatus, loading, error, refetch } = useDashboard();

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  const activeMonitors = monitors.filter((m) => m.isActive).length;
  const ongoingIncidents = incidents.filter((i) => i.status === "ONGOING").length;
  const resolvedIncidents = incidents.length - ongoingIncidents;
  const affectedCount = topologyStatus.reduce(
    (sum, entry) => sum + entry.potentiallyAffected.length,
    0
  );

  const healthyMonitors = monitors.length - ongoingIncidents;
  const healthPercent =
    monitors.length > 0 ? Math.round((healthyMonitors / monitors.length) * 100) : 100;

  return (
    <div>
      <h1>NETPULSE DASHBOARD</h1>

      <div className="panel" style={{ textAlign: "center" }}>
        <span
          className="stat-number"
          style={{
            fontSize: 48,
            color: healthPercent === 100 ? "var(--green)" : healthPercent > 50 ? "var(--yellow)" : "var(--pink)",
          }}
        >
          {healthPercent}%
        </span>
        <span className="stat-label">SYSTEM HEALTH</span>
      </div>

      <div className="stats-bar">
        <div className="stat-box">
          <span className="stat-number">{monitors.length}</span>
          <span className="stat-label">TOTAL MONITORS</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--green)" }}>{activeMonitors}</span>
          <span className="stat-label">ACTIVE</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--pink)" }}>{ongoingIncidents}</span>
          <span className="stat-label">ONGOING INCIDENTS</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--cyan)" }}>{resolvedIncidents}</span>
          <span className="stat-label">RESOLVED INCIDENTS</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--yellow)" }}>{affectedCount}</span>
          <span className="stat-label">POTENTIALLY AFFECTED</span>
        </div>
      </div>

      <button className="btn" onClick={refetch} style={{ marginBottom: 24 }}>
        REFRESH
      </button>

      <h2>ACTIVE INCIDENTS</h2>
      {topologyStatus.length === 0 && <p>No ongoing incidents — everything healthy.</p>}
      <div className="card-grid">
        {topologyStatus.map((entry, idx) => (
          <div key={idx} className="card is-down">
            <div className="card-header">
              <span className="card-title">{entry.downMonitor.name}</span>
              <span className="tag tag-tls">{entry.failureType}</span>
            </div>
            <div className="card-meta">{entry.downMonitor.target}</div>
            <div className="card-meta">Down since {new Date(entry.startedAt).toLocaleString()}</div>
            {entry.potentiallyAffected.length > 0 && (
              <div className="card-meta">
                ⚠️ {entry.potentiallyAffected.length} dependent service(s) affected
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>QUICK LINKS</h2>
      <div className="card-grid">
        <a href="/monitors" className="card is-up" style={{ textDecoration: "none" }}>
          <div className="card-title">MONITORS →</div>
          <div className="card-meta">View and manage all {monitors.length} monitors</div>
        </a>
        <a href="/incidents" className="card" style={{ textDecoration: "none" }}>
          <div className="card-title">INCIDENTS →</div>
          <div className="card-meta">{incidents.length} total incidents recorded</div>
        </a>
        <a href="/topology" className="card" style={{ textDecoration: "none" }}>
          <div className="card-title">TOPOLOGY →</div>
          <div className="card-meta">Dependency map and affected services</div>
        </a>
      </div>
    </div>
  );
}