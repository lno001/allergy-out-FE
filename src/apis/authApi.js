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
 * 성공 시 RefreshToken은 httpOnly 쿠키로, AccessToken은 응답 body(data.accessToken)로
 * 내려옵니다. body의 AccessToken은 axiosInstance 인터셉터가 자동으로 저장하므로
 * 호출부(훅 등)에서 따로 꺼내 저장할 필요 없습니다.
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
