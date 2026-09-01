import { clearAccessToken, setAccessToken } from "../utils/accessTokenStore";
import axiosInstance from "./axiosInstance";

export function signup(payload) {
  return axiosInstance.post("/auth/signup", payload);
}

export async function login(payload) {
  const res = await axiosInstance.post("/auth/login", payload);
  setAccessToken(res.data?.accessToken);
  return res;
}

export function getMe() {
  return axiosInstance.get("/auth/me");
}

export async function logout() {
  try {
    return await axiosInstance.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
}
