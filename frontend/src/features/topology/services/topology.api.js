import { api } from "@/common/lib/axios";

export const topologyApi = {
  getStatus: async () => {
    const res = await api.get("/dependencies/topology/status");
    return res.data;
  },
  getAll: async () => {
    const res = await api.get("/dependencies");
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/dependencies", data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/dependencies/${id}`);
    return res.data;
  },
};