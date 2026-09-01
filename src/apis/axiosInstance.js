import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  withCredentials: true,
});

const rejectAsEnvelope = (error) => {
  const body = error?.response?.data;
  if (body && typeof body === "object") {
    return Promise.reject({
      code: body.code,
      msg: body.msg ?? "요청을 처리하지 못했습니다.",
      data: body.data ?? null,
      status: error.response.status,
    });
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

axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === "object" && Number(body.code) >= 400) {
      return rejectAsEnvelope({
        response: { status: Number(body.code), data: body },
      });
    }
    return body;
  },
  (error) => rejectAsEnvelope(error),
);

export default axiosInstance;
