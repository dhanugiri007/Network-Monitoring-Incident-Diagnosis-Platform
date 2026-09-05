import { api } from "@/common/lib/axios";

export const incidentApi = {
  getAll: async () => {
    const res = await api.get("/incidents");
    return res.data;
  },
};