import axiosInstance from "./axiosInstance";

/**
 * 레시피 목록 — 검색·필터·정렬·페이지네이션 통합 엔드포인트.
 * GET /api/recipes (구 /api/recipes/filter 흡수, 2026-09-08 계약)
 *
 * params (axiosInstance 가 한글/`&` 자동 인코딩):
 * - page            : 0-based
 * - size            : 1~50
 * - keyword         : 제목 부분일치. 비면 생략
 * - excludeMaterials: 콤마로 이은 재료명. 그 재료가 든 레시피 제외. 비면 생략
 * - recipeType      : 요리 종류 완전일치 (밥/국&찌개/…). "전체" 면 생략
 * - cookingMethod   : 조리 방법 완전일치. "전체" 면 생략
 * - sort            : "latest"(기본) | "popular"(viewCount 내림차순)
 * - applyMyAllergy  : "false" 면 회원 알러지 자동 제외 끔 (기본은 켜짐 = 생략)
 *
 * 응답 data: { recipes: RecipeListItem[], pageInfo: {...} }
 */
export function getRecipeList(params) {
  return axiosInstance.get("/recipes", { params });
}

/**
 * 오늘의 추천 — 필터된 전체에서 날짜 시드로 최대 3개.
 * GET /api/recipes/recommend
 *
 * params: date(YYYY-MM-DD, 필수) + 목록과 같은 필터
 *   keyword, excludeMaterials, recipeType, cookingMethod, applyMyAllergy
 * page / size / sort 는 보내지 않음.
 */
export function getRecommendRecipes(params) {
  return axiosInstance.get("/recipes/recommend", { params });
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
