"use client";

import { useState, useEffect, useCallback } from "react";
import { monitorApi } from "../services/monitor.api";
import { metricsApi } from "../services/metrics.api";

export function useMonitorDetail(id) {
  const [monitor, setMonitor] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const monitorData = await monitorApi.getById(id);
      const metricsData = await metricsApi.getForMonitor(id);
      setMonitor(monitorData);
      setMetrics(metricsData.metrics); // backend returns { monitor, metrics }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { monitor, metrics, loading, error, refetch: fetchData };
}