"use client";

import { useIncidents } from "../hooks/useIncidents";

export default function IncidentList() {
  const { incidents, loading, error, refetch } = useIncidents();

  if (loading) return <p>Loading incidents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Incidents</h2>
      <button onClick={refetch}>Refresh</button>

      {incidents.length === 0 && <p>No incidents recorded.</p>}

      <ul>
        {incidents.map((incident) => (
          <li key={incident.id}>
            <strong>{incident.Monitor?.name}</strong> ({incident.Monitor?.target})
            <br />
            Status: {incident.status} | Failure type: {incident.failureType}
            <br />
            Started: {new Date(incident.startedAt).toLocaleString()}
            <br />
            {incident.status === "RESOLVED" && (
              <>
                Resolved: {new Date(incident.resolvedAt).toLocaleString()} | Downtime:{" "}
                {incident.downtimeSeconds}s
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}