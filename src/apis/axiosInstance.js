import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
