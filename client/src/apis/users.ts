// apis/users.ts
import { api } from "../lib/axios";
import type { User } from "../types/types";

export interface PaginatedUsersResponse {
  users: User[];
  total: number;
}

export const getAllUsers = async (
  page: number,
  limit: number
): Promise<PaginatedUsersResponse> => {
  const res = await api.get(`/users?page=${page}&limit=${limit}`);
  return res.data;
};

export const updateUser = async (
  userId: string,
  payload: {
    role?: User["role"];
    isActive?: boolean;
    password?: string;
  }
): Promise<User> => {
  const res = await api.put(`/users/${userId}`, {...payload, role: payload?.role?.toLocaleLowerCase()});
  return res.data;
};
