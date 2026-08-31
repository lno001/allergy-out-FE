import axiosInstance from "./axiosInstance";

/** 레시피 목록 (페이지네이션 + 검색어/필터) */
export function getRecipeList(params) {
  return axiosInstance.get("/recipes", { params });
}

/** 레시피 단건 조회 */
export function getRecipe(recipeNo) {
  return axiosInstance.get(`/recipes/${recipeNo}`);
}

/** 레시피 등록 */
export function createRecipe(payload) {
  return axiosInstance.post("/recipes", payload);
}

/** 레시피 수정 */
export function updateRecipe(recipeNo, payload) {
  return axiosInstance.put(`/recipes/${recipeNo}`, payload);
}

/** 레시피 삭제 */
export function deleteRecipe(recipeNo) {
  return axiosInstance.delete(`/recipes/${recipeNo}`);
}
