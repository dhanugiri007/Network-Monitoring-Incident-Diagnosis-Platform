"use client";

import { useIncidents } from "../hooks/useIncidents";

export default function IncidentList() {
  const { incidents, loading, error, refetch } = useIncidents();

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  const ongoingCount = incidents.filter((i) => i.status === "ONGOING").length;

  return (
    <div>
      <h1>INCIDENTS</h1>

      <div className="stats-bar">
        <div className="stat-box">
          <span className="stat-number">{incidents.length}</span>
          <span className="stat-label">TOTAL INCIDENTS</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--pink)" }}>{ongoingCount}</span>
          <span className="stat-label">ONGOING</span>
        </div>
        <div className="stat-box">
          <span className="stat-number" style={{ color: "var(--green)" }}>{incidents.length - ongoingCount}</span>
          <span className="stat-label">RESOLVED</span>
        </div>
      </div>

      <button className="btn" onClick={refetch} style={{ marginBottom: 20 }}>REFRESH</button>

      {incidents.length === 0 && <p>No incidents recorded.</p>}

      <div className="card-grid">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className={`card ${incident.status === "ONGOING" ? "is-down" : "is-up"}`}
          >
            <div className="card-header">
              <span className="card-title">{incident.Monitor?.name}</span>
              <span className={`badge ${incident.status === "ONGOING" ? "ongoing" : "resolved"}`}>
                {incident.status}
              </span>
            </div>
            <div className="card-meta">{incident.Monitor?.target}</div>
            <div>Failure: {incident.failureType}</div>
            <div className="card-meta">Started: {new Date(incident.startedAt).toLocaleString()}</div>
            {incident.status === "RESOLVED" && (
              <div className="card-meta">
                Resolved: {new Date(incident.resolvedAt).toLocaleString()} · Downtime: {incident.downtimeSeconds}s
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}