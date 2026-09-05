import { api } from "@/common/lib/axios.js";

export const monitorApi = {
  getAll: async () => {
    const res = await api.get("/monitors");
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/monitors/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/monitors", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/monitors/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/monitors/${id}`);
    return res.data;
  },
};