import { api } from "@/common/lib/axios";

export const metricsApi = {
  getForMonitor: async (id) => {
    const res = await api.get(`/metrics/${id}`);
    return res.data;
  },
};