import axiosInstance from "./axiosInstance";

/**
 * [마이] 즐겨찾기 레시피 목록 — GET /api/member/bookmark
 * @param {{ page?: number, size?: number }} [params] 예: { page: 0, size: 6 }
 */
export function getBookmarkList(params) {
  return axiosInstance.get("/member/bookmark", { params });
}

/**
 * [마이] 즐겨찾기 레시피 등록 — POST /api/member/bookmark
 * @param {number} recipeNo
 */
export function createBookmark(recipeNo) {
  return axiosInstance.post("/member/bookmark", { recipeNo });
}

/**
 * [마이] 즐겨찾기 레시피 삭제 — DELETE /api/member/bookmark/{recipeNo}
 * @param {number} recipeNo
 */
export function deleteBookmark(recipeNo) {
  return axiosInstance.delete(`/member/bookmark/${recipeNo}`);
}
