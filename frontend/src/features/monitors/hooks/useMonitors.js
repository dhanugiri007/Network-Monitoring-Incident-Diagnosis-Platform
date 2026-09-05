"use client";

import { useState, useEffect, useCallback } from "react";
import { monitorApi } from "../services/monitor.api";

export function useMonitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await monitorApi.getAll();
      setMonitors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  return { monitors, loading, error, refetch: fetchMonitors };
}
