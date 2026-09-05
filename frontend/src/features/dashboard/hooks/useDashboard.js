"use client";

import { useState, useEffect, useCallback } from "react";
import { monitorApi } from "@/features/monitors/services/monitor.api";
import { incidentApi } from "@/features/incidents/services/incident.api";
import { topologyApi } from "@/features/topology/services/topology.api";

export function useDashboard() {
  const [monitors, setMonitors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [topologyStatus, setTopologyStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [monitorsData, incidentsData, topologyData] = await Promise.all([
        monitorApi.getAll(),
        incidentApi.getAll(),
        topologyApi.getStatus(),
      ]);
      setMonitors(monitorsData);
      setIncidents(incidentsData);
      setTopologyStatus(topologyData);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { monitors, incidents, topologyStatus, loading, error, refetch: fetchAll };
}