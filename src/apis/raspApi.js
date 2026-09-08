import axiosInstance from "./axiosInstance";

/**
 * 라즈베리파이(만보기) 연동 API. 걸음 전송(POST /rasp/steps)은 라즈베리파이 기기 자신이
 * 호출하는 것이라 프론트는 안 씀.
 */

/** 내 디바이스 등록 (인증 필요, 멱등 — 이미 있으면 기존 deviceNo 그대로 반환) */
export function createDevice() {
  return axiosInstance.post("/rasp/devices");
}

/** 내 deviceNo 조회 (인증 필요). 미등록이면 404 */
export function getDevice() {
  return axiosInstance.get("/rasp/devices");
}

/** 오늘 걸음 추이 (당일 0시부터의 누적 보고 기록, 시간 오름차순). 미등록 기기면 404 */
export function getTodaySteps() {
  return axiosInstance.get("/rasp/steps/day");
}

/** 최근 7일 걸음 수 (오늘 포함, 날짜 오름차순 — 데이터 없는 날은 응답에서 생략됨) */
export function getDailySteps() {
  return axiosInstance.get("/rasp/steps/week");
}
