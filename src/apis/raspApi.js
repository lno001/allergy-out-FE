import axiosInstance from "./axiosInstance";

/**
 * 라즈베리파이(만보기) 연동 API. 문서(rasp 명세 v0.3 기준 응답 필드 확정판) 그대로.
 * 실제로 기기를 연결할 수 있는 건 팀의 데모 기기 하나뿐이라, 프론트는 기기 등록 없이
 * 조회만 한다 — 기기 등록(POST /rasp/devices)은 그 데모 기기를 세팅할 때 한 번 서버에
 * 직접 호출하는 운영 작업이라 화면에 두지 않는다. 걸음 전송(POST /rasp/steps)은
 * 라즈베리파이 기기 자신이 호출하는 것이라 마찬가지로 프론트는 안 씀.
 */

/** 오늘 걸음 추이 (당일 0시부터의 누적 보고 기록, 시간 오름차순). 데모 기기 미연동 시 404 */
export function getTodaySteps() {
  return axiosInstance.get("/rasp/steps/today");
}

/** 최근 7일 걸음 수 (오늘 포함, 날짜 오름차순 — 데이터 없는 날은 응답에서 생략됨) */
export function getDailySteps() {
  return axiosInstance.get("/rasp/steps/daily");
}
