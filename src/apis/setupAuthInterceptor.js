import axiosInstance from "./axiosInstance";
import { refresh } from "./authApi";
import { clearAccessToken, getAccessToken } from "../utils/accessTokenStore";

const AUTH_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh",
  "/auth/logout",
];

const isAuthPath = (url = "") => AUTH_PATHS.some((path) => url.includes(path));

let isRefreshing = false;
const pendingQueue = [];

const flushQueue = (error, token) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue.length = 0;
};

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
    (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthPath(originalRequest.url)
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest._retry = true;
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return refresh()
        .then((newToken) => {
          flushQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((refreshError) => {
          clearAccessToken();
          flushQueue(refreshError);
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.startsWith("/login")
          ) {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    },
  );
}
