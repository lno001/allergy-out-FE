import axiosInstance from "./axiosInstance";

/**
 * 회원가입 — POST /api/auth/signup
 * @param {{ memberId: string, memberPwd: string, memberName: string, phone: string, email: string }} payload
 */
export function signup(payload) {
  return axiosInstance.post("/auth/signup", payload);
}

/**
 * 로그인 — POST /api/auth/login
 * 성공 시 서버가 Access/Refresh 토큰을 httpOnly 쿠키로 내려줍니다 (body 에는 토큰 없음).
 * @param {{ memberId: string, memberPwd: string }} payload
 */
export function login(payload) {
  return axiosInstance.post("/auth/login", payload);
}

/**
 * 로그아웃 — POST /api/auth/logout
 */
export function logout() {
  return axiosInstance.post("/auth/logout");
}
