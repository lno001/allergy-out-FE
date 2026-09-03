import { useEffect, useState } from "react";

import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { ALLERGEN_CATEGORIES, ALLERGEN_TAXONOMY } from "../../constants/allergens";
import {
  Layout,
  KeyList,
  KeyRow,
  KeyCheckboxWrap,
  KeyNavButton,
  KeyBadge,
  ValuePanel,
  ValuePanelTitle,
  ValueList,
  ValueLabel,
  SelectionSummary,
  ClearButton,
} from "./FilterModal.styled";

/**
 * 재료 필터 모달 (RecipeListPage 전용)
 * -----------------------------------------------------------------------------
 * 좌: 알레르기 분류(key) 네비 / 우: 그 분류의 재료명(value) 체크박스(다중 선택).
 * 하단 "적용하기" → 체크된 재료명 배열을 onApply 로 넘긴다 (부모가 excludeMaterials 로 요청).
 *
 * - key 클릭 = 오른쪽 목록 전환(네비게이션). key 왼쪽 체크박스 = 그 분류 재료 전체 선택/해제.
 * - draft(작업 중 선택)는 모달 안에서만 관리하고, "적용하기" 전에는 목록에 반영하지 않는다.
 *   모달을 열 때마다 부모의 현재 선택(selected)으로 draft 를 초기화한다.
 *
 * props
 * - isOpen   : boolean
 * - selected : string[] — 현재 적용돼 있는 제외 재료명 (모달 열 때 draft 초기값)
 * - onApply  : (next: string[]) => void — "적용하기" 클릭 시
 * - onClose  : () => void — 취소 / ✕ / ESC / 배경
 */
function FilterModal({ isOpen, selected, onApply, onClose }) {
  const [draft, setDraft] = useState(/** @type {string[]} */ ([]));
  const [activeKey, setActiveKey] = useState(ALLERGEN_CATEGORIES[0]);

  // 열릴 때마다 부모의 현재 선택으로 draft 리셋 + 첫 분류로 이동
  useEffect(() => {
    if (!isOpen) return;
    setDraft(selected ?? []);
    setActiveKey(ALLERGEN_CATEGORIES[0]);
  }, [isOpen, selected]);

  const toggleMaterial = (name) => {
    setDraft((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    );
  };

  // 특정 분류에서 몇 개 골랐는지 (좌측 배지용)
  const countInCategory = (key) =>
    ALLERGEN_TAXONOMY[key].filter((name) => draft.includes(name)).length;

  // 분류 전체선택 체크박스 토글 (indeterminate 없음 — 전부 선택일 때만 checked):
  //  - 전부 선택돼 있으면 → 그 분류 재료 전부 해제
  //  - 하나라도 빠져 있으면 → 그 분류 재료 전부 선택
  //  값 하나만 빼도 count < total 이 되어 체크박스는 자동으로 unchecked 로 표시된다.
  const toggleCategory = (key) => {
    const values = ALLERGEN_TAXONOMY[key];
    const allSelected = values.every((name) => draft.includes(name));
    setDraft((prev) => {
      if (allSelected) return prev.filter((m) => !values.includes(m));
      const next = new Set(prev);
      values.forEach((name) => next.add(name));
      return [...next];
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="재료 필터"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            취소하기
          </Button>
          <Button variant="primary" onClick={() => onApply(draft)}>
            적용하기
          </Button>
        </>
      }
    >
      <Layout>
        <KeyList>
          {ALLERGEN_CATEGORIES.map((key) => {
            const count = countInCategory(key);
            const total = ALLERGEN_TAXONOMY[key].length;
            return (
              <KeyRow key={key} $active={key === activeKey}>
                <KeyCheckboxWrap>
                  <input
                    type="checkbox"
                    checked={count === total}
                    onChange={() => toggleCategory(key)}
                    aria-label={`${key} 전체 선택`}
                  />
                </KeyCheckboxWrap>
                <KeyNavButton
                  type="button"
                  $active={key === activeKey}
                  onClick={() => setActiveKey(key)}
                >
                  {key}
                  {count > 0 && <KeyBadge>{count}</KeyBadge>}
                </KeyNavButton>
              </KeyRow>
            );
          })}
        </KeyList>

        <ValuePanel>
          <ValuePanelTitle>{activeKey} — 제외할 재료 선택</ValuePanelTitle>
          <ValueList>
            {ALLERGEN_TAXONOMY[activeKey].map((name) => (
              <ValueLabel key={name}>
                <input
                  type="checkbox"
                  checked={draft.includes(name)}
                  onChange={() => toggleMaterial(name)}
                />
                {name}
              </ValueLabel>
            ))}
          </ValueList>
        </ValuePanel>
      </Layout>

      <SelectionSummary>
        <span>선택한 제외 재료 {draft.length}개</span>
        <ClearButton
          type="button"
          onClick={() => setDraft([])}
          disabled={draft.length === 0}
        >
          전체 해제
        </ClearButton>
      </SelectionSummary>
    </Modal>
  );
}

export default FilterModal;
