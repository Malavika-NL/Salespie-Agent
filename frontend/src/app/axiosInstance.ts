import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearAuthSession,
  getAuthHeader,
  refreshAuthSession,
  shouldSkipAuthRefresh,
} from "./authSession";

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : "",
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!import.meta.env.DEV && typeof config.url === "string" && config.url.startsWith("/api/")) {
      config.url = config.url.slice(4) || "/";
    }

    const authHeader = getAuthHeader();
    if (authHeader) {
      config.headers.Authorization = authHeader;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipAuthRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        const nextTokens = await refreshAuthSession();
        if (nextTokens?.access) {
          originalRequest.headers.Authorization = `Bearer ${nextTokens.access}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        console.error("Unauthorized - token refresh failed");
      }

      clearAuthSession();
    } else if (error.response?.status === 401) {
      console.error("Unauthorized - token may have expired");
    }

    if (error.response?.status === 403) {
      console.error("Forbidden - insufficient permissions");
    }
    if (error.response?.status === 500) {
      console.error("Server error - please try again later");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
