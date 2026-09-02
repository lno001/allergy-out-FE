import { useContext, useState } from "react";

import Alert from "../../../components/common/Alert";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import Loading from "../../../components/common/Loading";
import { ToastContext } from "../../../components/common/ToastProvider";
import { MAX_ALLERGY_COUNT, useAllergyProfile } from "../../../hooks/useAllergyProfile";
import { ALLERGY_OPTIONS } from "./allergyOptions";
import {
  AddRow,
  CardWrap,
  Chip,
  ChipEmptyText,
  ChipRemoveButton,
  ChipRow,
  FooterRow,
  OptionCheckbox,
  OptionGrid,
  OptionLabel,
  QuickAddButton,
  QuickAddGroup,
  QuickAddGroupLabel,
  QuickAddRow,
  Section,
  SectionDescription,
  SectionDivider,
  SectionLabel,
  SectionTitle,
} from "./AllergyManagePage.styled";
import { CATEGORY_BUNDLES, QUICK_BUNDLES } from "./allergyQuickAdd";

/**
 * 마이페이지 > 알러지 필터 관리 (/mypage/allergy)
 * ProfileEditPage와 같은 CardWrap/SectionTitle/SectionDivider 패턴을 써서
 * 마이페이지의 다른 탭과 같은 카드 하나로 보이게 한다(개별 Card로 안 쪼갬).
 * - "알러지 직접 추가": 목록에 없는 재료를 자유 입력으로 추가
 * - "빠른 추가": 묶음(5대 알러지 등)/계통 통째(갑각류·조개류·알류)를 버튼 한 번으로 추가.
 *   둘 다 토글 방식 — 이미 전부 등록돼 있으면 다시 눌렀을 때 전체 해제.
 * - "현재 등록된 필터": 지금 선택된 전체 목록 칩으로 요약, X로 제거
 * - "알레르기 의무표시 대상": 식약처 표시대상 원재료 체크박스.
 * "필터 저장하기"를 누르면 위 전체(칩에 보이는 것 전부)를 서버에 저장한다
 * (PATCH /api/members/allergy, 전체 교체).
 */
function AllergyManagePage() {
  const showToast = useContext(ToastContext);
  const {
    selected, toggle, addCustom, addMany, remove, removeMany, save, isLoading, isSaving, error,
  } = useAllergyProfile();
  const [customInput, setCustomInput] = useState("");

  const handleAddCustom = (e) => {
    e.preventDefault();
    const result = addCustom(customInput);
    if (result.ok) {
      setCustomInput("");
    } else if (result.msg) {
      showToast(result.msg, "danger");
    }
  };

  const handleQuickAdd = (items) => {
    const result = addMany(items);
    if (result.msg) showToast(result.msg, result.ok ? "success" : "danger");
  };

  /** "묶음"/"계통 통째" 버튼 공용 — 이미 전부 등록돼 있으면 한 번 더 눌렀을 때 전체 해제(토글) */
  const handleBundleToggle = (bundle) => {
    const allSelected = bundle.items.every((item) => selected.has(item));
    if (allSelected) {
      removeMany(bundle.items);
      return;
    }
    handleQuickAdd(bundle.items);
  };

  const isBundleSelected = (bundle) => bundle.items.every((item) => selected.has(item));

  const handleOptionToggle = (option) => {
    const result = toggle(option);
    if (!result.ok) showToast(result.msg, "danger");
  };

  const handleSave = async () => {
    const result = await save();
    showToast(result.msg, result.ok ? "success" : "danger");
  };

  if (isLoading) {
    return (
      <CardWrap>
        <Section>
          <Loading label="알러지 정보를 불러오는 중" />
        </Section>
      </CardWrap>
    );
  }

  const selectedList = Array.from(selected);

  return (
    <CardWrap>
      <SectionTitle>나의 알러지 필터 관리</SectionTitle>
      <SectionDescription>
        알러지 유발 재료를 등록하면, 그 재료가 들어간 레시피는 추천·검색에서 제외돼요.
      </SectionDescription>

      {error && (
        <Section>
          <Alert variant="danger">{error}</Alert>
        </Section>
      )}

      <SectionDivider />
      <Section>
        <SectionLabel>알러지 직접 추가</SectionLabel>
        <AddRow onSubmit={handleAddCustom}>
          <Input
            placeholder="재료명을 입력하세요 (예: 아보카도)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            maxLength={30}
          />
          <Button type="submit">추가</Button>
        </AddRow>
      </Section>

      <SectionDivider />
      <Section>
        <SectionLabel>빠른 추가</SectionLabel>

        <QuickAddGroup>
          <QuickAddGroupLabel>묶음</QuickAddGroupLabel>
          <QuickAddRow>
            {QUICK_BUNDLES.map((bundle) => (
              <QuickAddButton
                key={bundle.label}
                type="button"
                $active={isBundleSelected(bundle)}
                onClick={() => handleBundleToggle(bundle)}
              >
                {isBundleSelected(bundle) ? "✓" : "+"} {bundle.label}
              </QuickAddButton>
            ))}
          </QuickAddRow>
        </QuickAddGroup>

        <QuickAddGroup>
          <QuickAddGroupLabel>계통 통째</QuickAddGroupLabel>
          <QuickAddRow>
            {CATEGORY_BUNDLES.map((bundle) => (
              <QuickAddButton
                key={bundle.label}
                type="button"
                $active={isBundleSelected(bundle)}
                onClick={() => handleBundleToggle(bundle)}
              >
                {isBundleSelected(bundle) ? "✓" : "+"} {bundle.label}
              </QuickAddButton>
            ))}
          </QuickAddRow>
        </QuickAddGroup>
      </Section>

      <SectionDivider />
      <Section>
        <SectionLabel>현재 등록된 필터 ({selectedList.length}/{MAX_ALLERGY_COUNT})</SectionLabel>
        <ChipRow>
          {selectedList.length === 0 ? (
            <ChipEmptyText>아직 등록된 알러지 항목이 없어요.</ChipEmptyText>
          ) : (
            selectedList.map((item) => (
              <Chip key={item}>
                {item}
                <ChipRemoveButton
                  type="button"
                  aria-label={`${item} 제거`}
                  onClick={() => remove(item)}
                >
                  ✕
                </ChipRemoveButton>
              </Chip>
            ))
          )}
        </ChipRow>
      </Section>

      <SectionDivider />
      <Section>
        <SectionLabel>알레르기 의무표시 대상</SectionLabel>
        <OptionGrid role="group" aria-label="알러지 유발 재료 목록">
          {ALLERGY_OPTIONS.map((option) => (
            <OptionLabel key={option}>
              <OptionCheckbox
                checked={selected.has(option)}
                onChange={() => handleOptionToggle(option)}
              />
              {option}
            </OptionLabel>
          ))}
        </OptionGrid>
      </Section>

      <SectionDivider />
      <Section>
        <FooterRow>
          <Button onClick={handleSave} loading={isSaving} size="lg">
            필터 저장하기
          </Button>
        </FooterRow>
      </Section>
    </CardWrap>
  );
}

export default AllergyManagePage;
