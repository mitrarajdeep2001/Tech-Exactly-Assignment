import { api } from "../lib/axios";

export const fetchAllPosts = async (
  page?: number,
  limit?: number,
  postId?: string
) => {
  let url = "";
  if (postId) {
    url = `/blogs?blogId=${postId}`;
  } else {
    url = `/blogs?page=${page}&limit=${limit}`;
  }
  const res = await api.get(url);
  return res.data;
};

export const fetchMyPosts = async (
  page?: number,
  limit?: number,
  postId?: string
) => {
  let url = "";
  if (postId) {
    url = `/blogs/user?blogId=${postId}`;
  } else {
    url = `/blogs/user?page=${page}&limit=${limit}`;
  }
  const res = await api.get(url);
  return res.data;
};

export const createPosts = async (payload: FormData) => {
  const res = await api.post("/blogs", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updatePosts = async (payload: FormData, blogId: string) => {
  const res = await api.put(`/blogs/${blogId}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deletePosts = async (id: string) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};
