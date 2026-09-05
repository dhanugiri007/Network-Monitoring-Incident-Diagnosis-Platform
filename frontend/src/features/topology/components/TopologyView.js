"use client";

import { useState } from "react";
import { useTopology } from "../hooks/useTopology";
import { topologyApi } from "../services/topology.api";
import { useMonitors } from "@/features/monitors/hooks/useMonitors";

export default function TopologyView() {
  const { status, dependencies, loading, error, refetch } = useTopology();
  const { monitors } = useMonitors();

  const [parentId, setParentId] = useState("");
  const [childId, setChildId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!parentId || !childId) return;

    setSubmitting(true);
    setFormError(null);
    try {
      await topologyApi.create({
        parentMonitorId: Number(parentId),
        childMonitorId: Number(childId),
      });
      setParentId("");
      setChildId("");
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this dependency link?")) return;
    await topologyApi.delete(id);
    refetch();
  };

  if (loading) return <p>Loading topology...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div>
      <h1>NETWORK TOPOLOGY</h1>
      <button className="btn" onClick={refetch}>REFRESH</button>
      <h2>CURRENTLY DOWN</h2>
      {status.length === 0 && <p>No ongoing incidents — everything healthy.</p>}
      <div className="card-grid">
        {status.map((entry, idx) => (
          <div key={idx} className="card is-down">
            <div className="card-header">
              <span className="card-title">{entry.downMonitor.name}</span>
              <span className="tag tag-tls">{entry.failureType}</span>
            </div>
            <div className="card-meta">{entry.downMonitor.target}</div>
            <div className="card-meta">Down since {new Date(entry.startedAt).toLocaleString()}</div>
            {entry.potentiallyAffected.length > 0 ? (
              <ul className="pixel-list">
                {entry.potentiallyAffected.map((affected) => (
                  <li key={affected.id}>
                    <span className="status-dot warn"></span>
                    {affected.name} ({affected.target})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="card-meta">No dependent services.</p>
            )}
          </div>
        ))}
      </div>

      <div className="panel">
        <h3>DEFINE A DEPENDENCY</h3>
        <p style={{ color: "var(--text-dim)" }}>
          Child monitor depends on Parent monitor (if Parent goes down, Child may be affected)
        </p>
        <form onSubmit={handleCreate}>
          <div className="field">
            <label>Parent (the one that could go down)</label>
            <select value={parentId} onChange={(e) => setParentId(e.target.value)} required>
              <option value="">-- select --</option>
              {monitors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.target})
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Child (depends on parent)</label>
            <select value={childId} onChange={(e) => setChildId(e.target.value)} required>
              <option value="">-- select --</option>
              {monitors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.target})
                </option>
              ))}
            </select>
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "LINKING..." : "CREATE DEPENDENCY"}
          </button>

          {formError && <p className="error-text">{formError}</p>}
        </form>
      </div>

      <h2>ALL DEPENDENCY LINKS</h2>
      {dependencies.length === 0 && <p>No dependencies defined yet.</p>}
      <ul className="pixel-list">
        {dependencies.map((dep) => (
          <li key={dep.id}>
            Monitor #{dep.childMonitorId} depends on Monitor #{dep.parentMonitorId}{" "}
            <button className="btn btn-danger" onClick={() => handleDelete(dep.id)}>
              REMOVE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}