/**
 * "알러지 필터 관리" 화면의 "빠른 추가 > 묶음" 데이터. 전부 승현 님이 확정해준 원문 그대로.
 * MEMBER_ALLERGY.MATERIAL_NAME(NV 30)에 직접 저장되는 문자열이라, 항목 추가/변경은 반드시
 * 실제 등록될 문자열 그대로 여기부터 고칠 것 — 화면 라벨과 저장값이 분리되어 있지 않음.
 *
 * 분류별 하위 품목(알류/조개류 등)은 이제 constants/allergens.js 의 ALLERGEN_TAXONOMY로
 * 통일해서 씀 (2026-09-02) — 여기 있던 CATEGORY_BUNDLES/ALLERGEN_SUB_ITEMS는 그걸로 대체됨.
 */

/** 빠른 추가 — 묶음 버튼 (5대 알러지 등, 여러 재료를 한 번에) */
export const QUICK_BUNDLES = [
  { label: "5대 알러지", items: ["우유", "계란", "밀", "대두", "땅콩"] },
  { label: "우유+계란", items: ["우유", "계란"] },
  { label: "견과류", items: ["땅콩", "호두", "캐슈넛", "아몬드", "잣"] },
];
