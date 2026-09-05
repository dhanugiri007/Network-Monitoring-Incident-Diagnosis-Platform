"use client";

import { useState, useEffect, useCallback } from "react";
import { topologyApi } from "../services/topology.api";

export function useTopology() {
  const [status, setStatus] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusData, depsData] = await Promise.all([
        topologyApi.getStatus(),
        topologyApi.getAll(),
      ]);
      setStatus(statusData);
      setDependencies(depsData);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { status, dependencies, loading, error, refetch: fetchData };
}