import axios from "axios";

import axiosInstance from "./axiosInstance";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "../utils/accessTokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_PATHS = ["/auth/login", "/auth/signup", "/auth/refresh"];
const isAuthPath = (url = "") => AUTH_PATHS.some((path) => url.includes(path));

export function setupAuthInterceptor() {
  axiosInstance.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error.status ?? error.response?.status;

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthPath(originalRequest.url)
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        const newToken = refreshRes.data?.data?.accessToken;
        if (!newToken) {
          throw refreshRes;
        }
        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login")
        ) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    },
  );
}
