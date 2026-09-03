import axiosInstance from "./axiosInstance";

/** 레시피 목록 (페이지네이션 + 제목 검색어) — GET /api/recipes */
export function getRecipeList(params) {
  return axiosInstance.get("/recipes", { params });
}

/**
 * 레시피 목록 — 검색(keyword) + 알레르기 제외 필터(excludeMaterials) 통합.
 * GET /api/recipes/filter?page=&size=&keyword=&excludeMaterials=계란,우유
 * - keyword: 제목 부분일치. 없으면 생략
 * - excludeMaterials: 콤마로 이은 재료명 문자열. 그 재료가 든 레시피 제외. 없으면 생략
 * - 응답 구조는 getRecipeList 와 동일 (RecipeListResponse)
 */
export function getFilteredRecipes(params) {
  return axiosInstance.get("/recipes/filter", { params });
}

/** 레시피 단건 조회 */
export function getRecipe(recipeNo) {
  return axiosInstance.get(`/recipes/${recipeNo}`);
}

/** 레시피 등록 */
export function createRecipe(payload) {
  return axiosInstance.post("/recipes", payload);
}

/** 레시피 수정 (multipart/form-data — 백엔드 @PatchMapping) */
export function updateRecipe(recipeNo, payload) {
  return axiosInstance.patch(`/recipes/${recipeNo}`, payload);
}

/** 레시피 삭제 */
export function deleteRecipe(recipeNo) {
  return axiosInstance.delete(`/recipes/${recipeNo}`);
}
