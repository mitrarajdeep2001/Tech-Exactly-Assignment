import { api } from "../lib/axios";

export const getNotifications = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const res = await api.get(`/notifications?page=${page}&limit=${limit}`);
  return res.data;
};

export const markNotificationAsRead = async ({ id }: { id: string }) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markNotificationsAsRead = async () => {
  const res = await api.patch(`/notifications/read`);
  return res.data;
};
