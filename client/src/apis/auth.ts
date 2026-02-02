import { api } from "../lib/axios";

const API_BASE = import.meta.env.VITE_API_URL;
export const registerUser = async (data: {
  email: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = (data: { email: string; password: string }) => {
  return api.post("/auth/login", data, {
    withCredentials: true,
  });
};

export const handleGoogleLogin = () => {
  window.location.href = `${API_BASE}/auth/google`;
};

export const handleFacebookLogin = () => {
  window.location.href = `${API_BASE}/auth/facebook`;
};

export const getAccessToken = () => {
  return api.post(
    "/auth/refresh-token",
    {},
    {
      withCredentials: true,
    },
  );
};

export const logoutUser = () => {
  return api.post("/auth/logout", null, {
    withCredentials: true,
  });
};
