import axios, { AxiosError } from "axios";
import { notification } from "antd";
import type { ApiError } from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handling with Ant Design notification
// const { notification } = App.useApp();
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "Something went wrong";

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      notification.error({
        message: "Session expired",
        description: "Please log in again.",
      });
    } else if (status === 403) {
      notification.error({
        message: "Access denied",
        description: "You do not have permission.",
      });
    } else if (status === 404) {
      notification.error({ message: "Not found", description: message });
    } else if (status && status >= 500) {
      notification.error({
        message: "Server error",
        description: "Please try again later.",
      });
    }

    return Promise.reject(error);
  },
);

export default api;
