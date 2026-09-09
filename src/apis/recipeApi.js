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
 *   RecipeListItem.isBookmarked(boolean): 로그인(토큰 有) 시 그 회원의 즐겨찾기 여부,
 *   비로그인은 항상 false. (2026-09-09 계약)
 */
export function getRecipeList(params) {
  return axiosInstance.get("/recipes", { params });
}

/**
 * 내가 작성한 레시피 목록 — GET /api/recipes/me (2026-09-09 신규)
 *
 * - 인증: 필수 (토큰 없으면 401)
 * - params: { page(0-based, ≥0), size(1~50, 기본 20) }
 * - 정렬: 최신 작성순(작성일 desc) 고정
 * - 응답 data: { recipes: RecipeListItem[], pageInfo: {...} } — getRecipeList 와 동일 구조.
 *   내 글이라도 내가 북마크했으면 isBookmarked=true.
 * - 작성한 레시피 0건: 200 + data.recipes = []
 * - 400: page 음수 / size 범위 밖 / 존재하지 않는 페이지 (data 에 필드별 메시지)
 */
export function getMyRecipes(params) {
  return axiosInstance.get("/recipes/me", { params });
}

/**
 * 오늘의 추천 — 필터된 전체에서 "날짜" 시드로 최대 3개.
 * GET /api/recipes/recommend
 *
 * params: date(YYYY-MM-DD, 필수) + 목록과 같은 필터
 *   keyword, excludeMaterials, recipeType, cookingMethod, applyMyAllergy
 * page / size / sort 는 보내지 않음.
 *
 * ⚠️ 이 엔드포인트의 레시피 카드에는 아직 isBookmarked 가 없다(후속 배포 예정).
 *    사용하는 쪽에서 undefined → false 로 방어할 것.
 * ※ "칼로리 기반" 추천은 별도 엔드포인트로 분리됨 → getCalorieRecommendRecipes.
 */
export function getRecommendRecipes(params) {
  return axiosInstance.get("/recipes/recommend", { params });
}

/**
 * 칼로리 기반 추천 — GET /api/recipes/recommend/calorie (2026-09-09 경로 변경)
 *
 * 구 GET /api/recipes/recommend?totalCalories= 에서 이 경로로 이동.
 * - 인증: 필수
 * - params: { totalCalories: number }  (하루 목표 칼로리, 0 초과 10000 이하)
 * - 응답 data: { recipes: RecipeListItem[] }  — 페이지 없음, 최대 3개. isBookmarked 포함.
 * - 400: totalCalories 누락/범위 밖  ·  후보 없음: 200 + data.recipes = []
 */
export function getCalorieRecommendRecipes(params) {
  return axiosInstance.get("/recipes/recommend/calorie", { params });
}

/**
 * 레시피 단건 조회 — GET /api/recipes/{recipeNo}
 * 즐겨찾기 여부는 data.recipe.isBookmarked (비로그인·미배포 시 false 로 방어).
 */
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
