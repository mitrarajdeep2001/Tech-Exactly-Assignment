import { api } from "../lib/axios";

export const getDashboardAnalytics = async () => {
  const res = await api.get(`/analytics`);
  return res.data;
};
