/**
 * 조리법(recipe) 공용 상수 — 조리방법·요리종류 enum + 영양성분 필드 정의.
 * -----------------------------------------------------------------------------
 * 백엔드 계약(2026-09-08 확정):
 *  - cookingMethod / recipeType 는 아래 6개 문자열을 그대로 저장·응답하고, 화면에도
 *    변환 없이 그대로 노출한다 (라벨 매핑 없음. "국&찌개" 도 화면에 그대로).
 *  - enum 선언 순서와 무관하게 "기타" 는 항상 목록 맨 뒤.
 *  - 영양성분 5종은 전부 nullable(Double). 값이 없으면(null/undefined/"") 화면에 "미입력".
 *  - 단위(kcal/g/mg)는 백엔드가 아니라 프론트가 붙인다.
 */

/** 조리 방법 — RECIPES.COOKING_METHOD (NOT NULL). 등록/수정 셀렉트 옵션 + 목록 필터 축. */
export const COOKING_METHODS = ["굽기", "튀기기", "볶기", "찌기", "끓이기", "기타"];

/** 요리 종류 — RECIPES.RECIPE_TYPE (NOT NULL). 등록/수정 셀렉트 옵션 + 목록 카테고리 필터. */
export const RECIPE_TYPES = ["밥", "국&찌개", "반찬", "일품", "후식", "기타"];

/**
 * 영양성분 5종 — 상세 표시 + 등록/수정 입력 공용.
 * key   : API JSON 필드명 (요청·응답 동일)
 * label : 화면 표기
 * unit  : 프론트가 값 뒤에 붙이는 단위
 */
export const NUTRITION_FIELDS = [
  { key: "calorie", label: "칼로리", unit: "kcal" },
  { key: "carbohydrate", label: "탄수화물", unit: "g" },
  { key: "protein", label: "단백질", unit: "g" },
  { key: "fat", label: "지방", unit: "g" },
  { key: "sodium", label: "나트륨", unit: "mg" },
];

/** mainMaterial 최대 길이 — 백엔드 @Size(20). "메인 재료 1개"라 콤마 리스트 아님. */
export const MAIN_MATERIAL_MAX_LENGTH = 20;

/** nullable 값이 비어 있을 때 화면에 대신 보여줄 문구 (팀 규칙 2026-09-08). */
export const EMPTY_TEXT = "미입력";

/** 값이 비었는지 (null / undefined / 빈 문자열) — 표시·전송 판단 공용. */
export const isBlankValue = (value) =>
  value === null || value === undefined || value === "";

/**
 * 화면 표시용 포맷.
 * - 값 있음 → "12 g" (unit 없으면 값만)
 * - 값 없음 → "미입력"
 * 소수(예: 120.5)는 백엔드가 준 그대로 보여준다.
 */
export const formatMeasure = (value, unit) =>
  isBlankValue(value) ? EMPTY_TEXT : unit ? `${value} ${unit}` : String(value);

/** 등록 폼 초기값 / "전체 해제" 용 빈 영양성분 객체 ({ calorie: "", ... }). */
export const emptyNutrition = () =>
  NUTRITION_FIELDS.reduce((acc, { key }) => ({ ...acc, [key]: "" }), {});

/** 상세 조회 응답(recipe)에서 영양성분만 뽑아 폼 상태로 (null → ""). */
export const nutritionFromRecipe = (recipe = {}) =>
  NUTRITION_FIELDS.reduce(
    (acc, { key }) => ({ ...acc, [key]: recipe[key] ?? "" }),
    {},
  );
