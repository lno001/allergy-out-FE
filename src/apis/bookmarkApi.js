import axiosInstance from "./axiosInstance";

/**
 * 즐겨찾기 API — 명세: 즐겨찾기 API 명세서 draft(2026-09-03). base path: /api/bookmarks.
 * memberNo 는 서버가 토큰(@AuthenticationPrincipal)에서 꺼내므로 요청에 안 넣는다.
 */

/**
 * @typedef {Object} BookmarkListItem
 * @property {number} recipeNo
 * @property {string} recipeTitle
 * @property {string} recipeMainImg - 원본 파일명 (썸네일엔 안 씀)
 * @property {string} recipesImgPath - S3 URL (썸네일)
 * @property {string} memberName - 작성자
 * @property {string} createDate - 레시피 작성일 (yyyy-MM-dd)
 *
 * @typedef {Object} PageInfo
 * @property {number} page
 * @property {number} size
 * @property {number} offset
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * [마이] 즐겨찾기 목록 조회 — GET /api/bookmarks
 * page 0-based, size 기본 20 (1~50). page<0 / size 범위 밖 / 존재하지 않는 페이지 → 400.
 * 북마크 0개면 200 + { recipes: [], pageInfo: { totalElements: 0, totalPages: 0 } }.
 * @param {{ page?: number, size?: number }} [params]
 * @returns {Promise<import('./memberApi').ApiOk<{ recipes: BookmarkListItem[], pageInfo: PageInfo }>>}
 */
export function getBookmarkList(params) {
  return axiosInstance.get("/bookmarks", { params });
}

/**
 * [마이] 즐겨찾기 등록 — POST /api/bookmarks
 * 404: 존재하지 않는 레시피 / 409: 이미 즐겨찾기함 ({ recipeNo: "이미 즐겨찾기한 레시피입니다." }).
 * @param {number} recipeNo
 * @returns {Promise<import('./memberApi').ApiOk<null>>} - 성공 201
 */
export function createBookmark(recipeNo) {
  return axiosInstance.post("/bookmarks", { recipeNo });
}

/**
 * [마이] 즐겨찾기 삭제 — DELETE /api/bookmarks/{recipeNo}
 * 대상 없음 → 404 (클라이언트에선 "이미 해제됨"으로 멱등 취급 가능 — 에러 토스트 X).
 * @param {number} recipeNo
 * @returns {Promise<import('./memberApi').ApiOk<null>>} - 성공 200
 */
export function deleteBookmark(recipeNo) {
  return axiosInstance.delete(`/bookmarks/${recipeNo}`);
}
