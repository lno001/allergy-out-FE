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

const rejectAsEnvelope = (error) => {
  const body = error?.response?.data;
  if (body && typeof body === "object") {
    return Promise.reject({
      code: body.code,
      msg: body.msg ?? "요청을 처리하지 못했습니다.",
      data: body.data ?? null,
      status: error.response.status,
      config: error.config,
    });
  }
  if (error && typeof error === "object" && "code" in error && "msg" in error) {
    return Promise.reject(error);
  }
  return Promise.reject({
    code: 0,
    msg:
      error?.code === "ECONNABORTED"
        ? "요청 시간이 초과되었습니다."
        : "네트워크 오류가 발생했습니다.",
    data: null,
    status: 0,
  });
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
      const status = error.response?.status ?? error.status;

      if (
        status !== 401 ||
        !originalRequest ||
        originalRequest._retry ||
        isAuthPath(originalRequest.url)
      ) {
        return rejectAsEnvelope(error);
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
          return rejectAsEnvelope(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    },
  );
}
