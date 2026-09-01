/**
 * AccessToken을 메모리 변수로만 보관합니다 (localStorage/sessionStorage 사용 안 함).
 * XSS로 스크립트가 탈취해가는 걸 막기 위해서입니다. 새로고침하면 사라지고,
 * axiosInstance가 /auth/refresh 응답으로 다시 채웁니다 (RefreshToken은 HttpOnly
 * 쿠키라 새로고침 후에도 브라우저가 자동으로 들고 있습니다).
 *
 * 이 모듈은 axiosInstance의 인터셉터만 사용합니다. 훅/컴포넌트에서 직접 import해서
 * 쓰지 마세요 (T-5 규칙: 토큰/헤더는 인터셉터 담당).
 */
let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}
