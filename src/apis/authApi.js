import axios from "axios";
import axiosInstance from "./axiosInstance";
import { setAccessToken, clearAccessToken } from "../utils/accessTokenStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function refresh() {
  const res = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  );
  const accessToken = res.data?.data?.accessToken ?? null;
  if (accessToken) {
    setAccessToken(accessToken);
  }
  return accessToken;
}

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
