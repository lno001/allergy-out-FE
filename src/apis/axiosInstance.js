import axios from "axios";

import { getAccessToken, setAccessToken, clearAccessToken } from "../utils/tokenStorage";

/**
 * 모든 API 호출은 이 인스턴스를 통해 나갑니다.
 * VITE_API_BASE_URL 은 API 서버 주소이며 공통 접두사 `/api` 를 포함합니다
 * (예: http://localhost:8080/api). 그래서 각 요청 경로는 `/auth/login` 처럼 씁니다.
 *
 * [토큰 저장 방식 — AccessToken은 메모리, RefreshToken만 httpOnly 쿠키]
 * 실제 백엔드 동작 기준(2026-09-01 확인)으로 정정합니다:
 *   - RefreshToken만 서버가 Set-Cookie(httpOnly, Secure, SameSite)로 내려줍니다.
 *   - AccessToken은 로그인/재발급 응답 **body**의 `data.accessToken`으로 내려오고,
 *     프론트가 매 요청마다 `Authorization: Bearer {accessToken}` 헤더로 직접 실어 보내야
 *     인증됩니다 (서버가 쿠키에서 AccessToken을 읽지 않음).
 *   - 그래서 AccessToken은 `utils/tokenStorage.js`의 메모리 변수로만 들고 있고
 *     (localStorage 등에 저장 금지 — XSS 탈취 위험), 아래 인터셉터가 로그인/재발급
 *     응답에서 자동으로 채우고, 요청마다 자동으로 헤더에 붙입니다.
 *   - `withCredentials: true`는 RefreshToken 쿠키 자동 첨부용으로 계속 필요합니다.
 *
 * [응답 봉투 — 성공/실패 동일]
 * 서버는 모든 응답을 `{ code, msg, data }` (JSON)로 내려줍니다.
 *   - 성공: code 2xx,  결과.data = payload,  결과.msg = 안내 문구
 *   - 실패: code 4xx/5xx,  결과.data = null,  결과.msg = 에러 문구
 * 인터셉터가 이 봉투를 기준으로 성공은 resolve, 실패는 reject 하므로 호출부는:
 *   try  { const res = await getMember(); res.data / res.msg }
 *   catch{ err.msg / err.code / err.status }   ← 성공과 같은 필드 위치
 *
 * [HTTP status 규약 — 둘 다 대응]
 *   A) 실패 시 HTTP status도 401/403/... 로 줌  → axios가 throw → 에러 인터셉터
 *   B) HTTP는 항상 200, body의 code가 진짜 상태  → 성공 인터셉터에서 code로 분기
 * 아래 코드는 A/B 모두 동일하게 동작합니다.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT_MS = 10_000;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  withCredentials: true, // 모든 요청에 httpOnly 쿠키(RefreshToken) 자동 첨부
});

/** 요청마다 메모리에 있는 AccessToken을 Authorization 헤더로 자동 첨부 */
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ------------------------------------------------------------------ *
 * 공통 유틸
 * ------------------------------------------------------------------ */

/**
 * 로그인 / 회원가입 / 재발급 요청.
 * 여기서 나는 401은 "Access 토큰 만료"가 아니라
 *   - 로그인·회원가입: 자격증명 오류 (비밀번호 틀림 등)
 *   - 재발급: Refresh 토큰까지 만료/무효
 * 이므로 재발급을 시도하면 안 되고, 서버가 준 에러 봉투를 그대로 화면에 넘깁니다.
 */
const AUTH_PATHS = ["/auth/login", "/auth/signup", "/auth/refresh"];
const isAuthPath = (url = "") => AUTH_PATHS.some((path) => url.includes(path));

/**
 * (선택) 만료/없음 vs 변조 를 백엔드가 code 로 구분해 주면 여기서 활용.
 * - REFRESHABLE_CODE : Access 토큰만 만료 → 재발급 시도할 가치가 있음
 * - 그 외 401       : 변조 등 → 재발급 건너뛰고 바로 로그인
 * 백엔드가 구분값을 안 주면 이 목록을 비워두면 됨 → 모든 401을 "일단 재발급 1회 시도".
 */
const REFRESHABLE_CODES = [401]; // 예: 백엔드가 세분화하면 [40101] 로 좁히고 40102(변조)는 제외
const isRefreshable = (code) => REFRESHABLE_CODES.includes(Number(code));

/** 어떤 실패든 { code, msg, data, status } 모양으로 통일해서 reject */
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
  // 네트워크 끊김 / 타임아웃 등 응답 자체가 없음
  return Promise.reject({
    code: 0,
    msg: error?.code === "ECONNABORTED" ? "요청 시간이 초과되었습니다." : "네트워크 오류가 발생했습니다.",
    data: null,
    status: 0,
  });
};

/** RefreshToken 재발급 실패 → 로그인 페이지로. (이미 로그인 페이지면 이동 안 함) */
const redirectToLogin = () => {
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
};

/* ------------------------------------------------------------------ *
 * 401 → RefreshToken 쿠키로 "한 번만" 재발급
 *   - 동시에 여러 요청이 401을 받아도 재발급은 1회로 모음 (pendingQueue)
 *   - 재발급 요청은 인터셉터를 안 타도록 순수 axios 사용 (무한 루프 방지)
 * ------------------------------------------------------------------ */
let isRefreshing = false;
let pendingQueue = [];

const flushQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  pendingQueue = [];
};

const requestTokenRefresh = () =>
  axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true }).then((res) => {
    // 재발급 응답도 봉투({code,msg,data})라 body.data.accessToken 위치에서 새 토큰을 꺼내 저장.
    // 이 요청은 axiosInstance가 아닌 순수 axios라 성공 인터셉터를 안 타므로 여기서 직접 저장한다.
    const newToken = res.data?.data?.accessToken;
    if (newToken) setAccessToken(newToken);
    return res;
  });

/**
 * 401 처리 본체. 성공 인터셉터(규약 B)와 에러 인터셉터(규약 A) 양쪽에서 호출됩니다.
 * @param {object} originalRequest  실패한 요청의 axios config
 * @param {object} originalError    (있으면) 원본 axios 에러 — reject 시 봉투 변환에 사용
 */
const handleUnauthorized = (originalRequest, originalError) => {
  // 재발급 대상이 아니면(로그인/회원가입/재발급 자체, 이미 재시도함) 그대로 실패
  if (!originalRequest || originalRequest._retry || isAuthPath(originalRequest.url)) {
    return rejectAsEnvelope(originalError ?? { response: { status: 401, data: originalRequest?.__body } });
  }

  // 이미 재발급이 진행 중이면 끝나기를 기다렸다가 원래 요청만 재시도.
  // _retry 를 찍어둬서, 재시도한 요청이 또 401이면 재발급을 다시 돌지 않고 바로 실패시킴.
  if (isRefreshing) {
    originalRequest._retry = true;
    return new Promise((resolve, reject) => {
      pendingQueue.push({ resolve, reject });
    }).then(() => axiosInstance(originalRequest));
  }

  originalRequest._retry = true;
  isRefreshing = true;

  return requestTokenRefresh()
    .then(() => {
      // requestTokenRefresh 안에서 이미 새 AccessToken을 tokenStorage에 저장했음.
      // 원래 요청을 재시도하면 요청 인터셉터가 새 토큰을 헤더에 다시 붙여준다.
      flushQueue(null);
      return axiosInstance(originalRequest);
    })
    .catch((refreshError) => {
      flushQueue(refreshError);
      clearAccessToken();
      redirectToLogin();
      return rejectAsEnvelope(refreshError);
    })
    .finally(() => {
      isRefreshing = false;
    });
};

/* ------------------------------------------------------------------ *
 * 인터셉터
 * ------------------------------------------------------------------ */

axiosInstance.interceptors.response.use(
  (response) => {
    const body = response.data;

    // 규약 B: HTTP 200 이지만 body.code 가 인증 실패인 경우
    if (body && typeof body === "object" && Number(body.code) === 401) {
      const req = response.config;
      req.__body = body; // 재발급 불가 시 봉투 변환에 쓰도록 보관
      if (isRefreshable(body.code)) {
        return handleUnauthorized(req);
      }
      clearAccessToken();
      redirectToLogin();
      return rejectAsEnvelope({ response: { status: 401, data: body } });
    }

    // 규약 B: 그 외 논리적 실패 (403/404/409/500 …)
    if (body && typeof body === "object" && Number(body.code) >= 400) {
      return rejectAsEnvelope({ response: { status: Number(body.code), data: body } });
    }

    // 로그인 성공 응답 등 body.data.accessToken이 있으면 메모리에 저장 (재발급은
    // requestTokenRefresh가 별도로 저장하므로 여기서 또 저장해도 같은 값이라 무해함).
    if (body?.data?.accessToken) {
      setAccessToken(body.data.accessToken);
    }
    if (response.config?.url?.includes("/auth/logout")) {
      clearAccessToken();
    }

    // 정상: 봉투 그대로 반환 (결과.data / 결과.msg)
    return body;
  },
  (error) => {
    // 규약 A: axios가 throw 한 실제 HTTP 에러
    const status = error.response?.status;
    const body = error.response?.data;

    if (status === 401) {
      if (isRefreshable(body?.code ?? 401)) {
        return handleUnauthorized(error.config, error);
      }
      clearAccessToken();
      redirectToLogin();
      return rejectAsEnvelope(error);
    }

    return rejectAsEnvelope(error);
  },
);

export default axiosInstance;
