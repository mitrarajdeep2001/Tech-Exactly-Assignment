import { api } from "../lib/axios";

export const fetchFeed = async (page: number, limit: number) => {
  const res = await api.get(`/blogs/feed?page=${page}&limit=${limit}`);
  return res.data;
};

