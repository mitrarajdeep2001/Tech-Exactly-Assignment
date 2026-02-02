import { api } from "../lib/axios";

export const addComment = async (
  postId: string,
  content: string
) => {
  const res = await api.post(`/comments/blog/${postId}`, { content });
  return res.data;
};

export const updateComment = async (
  commentId: string,
  content: string
) => {
  await api.put(`/comments/${commentId}`, { content });
};

export const deleteComment = async (commentId: string) => {
  await api.delete(`/comments/${commentId}`);
};