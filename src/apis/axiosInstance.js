import axios from "axios";

// 배포 서버에서는 public/config.js(window.ENV.API_URL)만 고치면 되고,
// 재빌드 없이 바로 반영된다 — 로컬 개발 중에는 window.ENV가 없으니 .env 값을 그대로 씀.
const API_BASE_URL = window.ENV?.API_URL ?? import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use((response) => {
  const body = response.data;
  if (body && typeof body === "object" && Number(body.code) >= 400) {
    return Promise.reject({
      code: body.code,
      msg: body.msg ?? "요청을 처리하지 못했습니다.",
      data: body.data ?? null,
      status: Number(body.code),
      config: response.config,
    });
  }
  return body;
});

export default axiosInstance;
