"use client";

import { useState } from "react";
import { useTopology } from "../hooks/useTopology";
import { topologyApi } from "../services/topology.api";
import { useMonitors } from "@/features/monitors/hooks/useMonitors";

export default function TopologyView() {
  const { status, dependencies, loading, error, refetch } = useTopology();
  const { monitors } = useMonitors(); // to populate dropdowns

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
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Network Topology</h2>
      <button onClick={refetch}>Refresh</button>

      <h3>Currently Down (with affected services)</h3>
      {status.length === 0 && <p>No ongoing incidents — everything healthy.</p>}
      <ul>
        {status.map((entry, idx) => (
          <li key={idx}>
            <strong>{entry.downMonitor.name}</strong> ({entry.downMonitor.target}) — DOWN since{" "}
            {new Date(entry.startedAt).toLocaleString()} ({entry.failureType})
            {entry.potentiallyAffected.length > 0 ? (
              <ul>
                {entry.potentiallyAffected.map((affected) => (
                  <li key={affected.id}>
                    ⚠️ Potentially affected: {affected.name} ({affected.target})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No dependent services.</p>
            )}
          </li>
        ))}
      </ul>

      <hr />

      <h3>Define a Dependency</h3>
      <p>Child monitor depends on Parent monitor (if Parent goes down, Child may be affected)</p>
      <form onSubmit={handleCreate}>
        <div>
          <label>Parent (the one that could go down): </label>
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} required>
            <option value="">-- select --</option>
            {monitors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.target})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Child (depends on parent): </label>
          <select value={childId} onChange={(e) => setChildId(e.target.value)} required>
            <option value="">-- select --</option>
            {monitors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.target})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Linking..." : "Create Dependency"}
        </button>

        {formError && <p style={{ color: "red" }}>{formError}</p>}
      </form>

      <hr />

      <h3>All Dependency Links</h3>
      {dependencies.length === 0 && <p>No dependencies defined yet.</p>}
      <ul>
        {dependencies.map((dep) => (
          <li key={dep.id}>
            Monitor #{dep.childMonitorId} depends on Monitor #{dep.parentMonitorId}{" "}
            <button onClick={() => handleDelete(dep.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}