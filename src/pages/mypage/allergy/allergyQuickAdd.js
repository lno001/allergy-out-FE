import { ALLERGEN_TAXONOMY } from "../../../constants/allergens";

/**
 * "알러지 필터 관리" 화면의 "빠른 추가 > 묶음" 데이터. 전부 승현 님이 확정해준 원문 그대로.
 * MEMBER_ALLERGY.MATERIAL_NAME(NV 30)에 직접 저장되는 문자열이라, 항목 추가/변경은 반드시
 * 실제 등록될 문자열 그대로 여기부터 고칠 것 — 화면 라벨과 저장값이 분리되어 있지 않음.
 *
 * 분류별 하위 품목(알류/조개류 등)은 이제 constants/allergens.js 의 ALLERGEN_TAXONOMY로
 * 통일해서 씀 (2026-09-02) — 여기 있던 CATEGORY_BUNDLES/ALLERGEN_SUB_ITEMS는 그걸로 대체됨.
 * "육류" 묶음도 같은 이유로 하드코딩 안 하고 ALLERGEN_TAXONOMY에서 그대로 펼쳐서 씀
 * (돼지고기/닭고기/쇠고기 각각의 하위 품목 목록이 바뀌면 이 묶음도 자동으로 같이 바뀜).
 */

/** 빠른 추가 — 묶음 버튼 (5대 알러지 등, 여러 재료를 한 번에) */
export const QUICK_BUNDLES = [
  { label: "5대 알러지", items: ["우유", "계란", "밀", "대두", "땅콩"] },
  {
    label: "우유+계란",
    items: [...ALLERGEN_TAXONOMY["우유"], ...ALLERGEN_TAXONOMY["알류"]],
  },
  { label: "견과류", items: ["땅콩", "호두", "캐슈넛", "아몬드", "잣"] },
  {
    label: "육류",
    items: [
      ...ALLERGEN_TAXONOMY["돼지고기"],
      ...ALLERGEN_TAXONOMY["닭고기"],
      ...ALLERGEN_TAXONOMY["쇠고기"],
    ],
  },
  {
    label: "해산물",
    items: [
      ...ALLERGEN_TAXONOMY["게"],
      ...ALLERGEN_TAXONOMY["새우"],
      ...ALLERGEN_TAXONOMY["오징어"],
      ...ALLERGEN_TAXONOMY["조개류"],
    ],
  },
  {
    label: "밀·곡류",
    items: ["밀", "메밀", "귀리", "보리", "호밀", "옥수수", "쌀", "기장", "수수"],
  },
  {
    label: "대두·콩",
    items: [
      "대두", "콩", "두부", "된장", "간장", "청국장", "콩가루",
      "콩나물", "검은콩", "완두콩", "강낭콩", "병아리콩", "렌틸콩",
    ],
  },
  {
    label: "과일",
    items: [
      "복숭아", "사과", "키위", "딸기", "체리", "살구", "자두", "배",
      "포도", "바나나", "망고", "파인애플", "귤", "오렌지", "레몬",
    ],
  },
];
