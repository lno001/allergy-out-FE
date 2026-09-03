import axiosInstance from "./axiosInstance";

/**
 * 모든 함수는 서버 공통 봉투 `{ code, msg, data }` 를 그대로 resolve 합니다.
 * 경로는 `/api` 접두사를 생략합니다 (VITE_API_BASE_URL 에 포함).
 */

/** [마이] 회원 알러지 정보 조회 — GET /api/members/allergy */
export function getMyAllergies() {
  return axiosInstance.get("/members/allergy");
}

/**
 * [마이] 회원 알러지 정보 수정 — PATCH /api/members/allergy
 * @param {string[]} allergyList 예: ["땅콩", "우유", "갑각류", "아보카도"]
 */
export function updateMyAllergies(allergyList) {
  return axiosInstance.patch("/members/allergy", { allergyList });
}
