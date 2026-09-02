import { useContext, useState } from "react";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import { ToastContext } from "../../components/common/ToastProvider";
import { MAX_ALLERGY_COUNT, useAllergyProfile } from "../../hooks/useAllergyProfile";
import { ALLERGY_OPTIONS } from "./allergyOptions";
import {
  AddRow,
  Banner,
  BannerSubtitle,
  BannerTitle,
  Card,
  CardTitle,
  Chip,
  ChipEmptyText,
  ChipRemoveButton,
  ChipRow,
  FooterRow,
  OptionCheckbox,
  OptionGrid,
  OptionLabel,
  PageWrapper,
  QuickAddButton,
  QuickAddGroup,
  QuickAddGroupLabel,
  QuickAddRow,
} from "./AllergyManagePage.styled";
import { ALLERGEN_SUB_ITEMS, CATEGORY_BUNDLES, QUICK_BUNDLES, QUICK_SINGLE_ITEMS } from "./allergyQuickAdd";

/**
 * 마이페이지 > 알러지 필터 관리 (/mypage/allergy)
 * - "빠른 추가": 묶음(5대 알러지 등)/계통(갑각류 등)/개별 항목을 버튼 한 번으로 추가
 * - "알러지 직접 추가": 목록에 없는 재료를 자유 입력으로 추가
 * - "현재 등록된 필터": 지금 선택된 전체 목록 칩으로 요약, X로 제거
 * - "전체 알러지 항목": 식약처 표시대상 원재료 18종 체크박스.
 *   이 중 "알류"/"조개류"는 그 자체가 아니라 하위 구체 품목 전체(ALLERGEN_SUB_ITEMS)가
 *   체크/저장된다 — 체크박스 상태도 하위 품목이 전부 selected일 때만 checked로 표시.
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

  /** 메인 목록 체크박스 클릭 — 하위 품목이 있는 항목(알류/조개류)은 그 품목 전체를 토글 */
  const handleOptionToggle = (option) => {
    const subItems = ALLERGEN_SUB_ITEMS[option];
    if (!subItems) {
      const result = toggle(option);
      if (!result.ok) showToast(result.msg, "danger");
      return;
    }
    const allSelected = subItems.every((item) => selected.has(item));
    if (allSelected) {
      removeMany(subItems);
      return;
    }
    const result = addMany(subItems);
    if (result.msg) showToast(result.msg, result.ok ? "success" : "danger");
  };

  const isOptionChecked = (option) => {
    const subItems = ALLERGEN_SUB_ITEMS[option];
    return subItems ? subItems.every((item) => selected.has(item)) : selected.has(option);
  };

  const handleSave = async () => {
    const result = await save();
    showToast(result.msg, result.ok ? "success" : "danger");
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Loading label="알러지 정보를 불러오는 중" />
      </PageWrapper>
    );
  }

  const selectedList = Array.from(selected);

  return (
    <PageWrapper>
      <Banner>
        <BannerTitle>나의 알러지 필터 관리</BannerTitle>
        <BannerSubtitle>
          알러지 유발 재료를 등록하면, 그 재료가 들어간 레시피는 추천·검색에서 제외돼요.
        </BannerSubtitle>
      </Banner>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <CardTitle>빠른 추가</CardTitle>

        <QuickAddGroup>
          <QuickAddGroupLabel>묶음</QuickAddGroupLabel>
          <QuickAddRow>
            {QUICK_BUNDLES.map((bundle) => (
              <QuickAddButton key={bundle.label} type="button" onClick={() => handleQuickAdd(bundle.items)}>
                + {bundle.label}
              </QuickAddButton>
            ))}
          </QuickAddRow>
        </QuickAddGroup>

        <QuickAddGroup>
          <QuickAddGroupLabel>계통 통째</QuickAddGroupLabel>
          <QuickAddRow>
            {CATEGORY_BUNDLES.map((bundle) => (
              <QuickAddButton key={bundle.label} type="button" onClick={() => handleQuickAdd(bundle.items)}>
                + {bundle.label}
              </QuickAddButton>
            ))}
          </QuickAddRow>
        </QuickAddGroup>

        <QuickAddGroup>
          <QuickAddGroupLabel>개별 항목</QuickAddGroupLabel>
          <QuickAddRow>
            {QUICK_SINGLE_ITEMS.map((item) => (
              <QuickAddButton key={item} type="button" onClick={() => handleQuickAdd([item])}>
                + {item}
              </QuickAddButton>
            ))}
          </QuickAddRow>
        </QuickAddGroup>
      </Card>

      <Card>
        <CardTitle>알러지 직접 추가</CardTitle>
        <AddRow onSubmit={handleAddCustom}>
          <Input
            placeholder="재료명을 입력하세요 (예: 아보카도)"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            maxLength={30}
          />
          <Button type="submit">추가</Button>
        </AddRow>
      </Card>

      <Card>
        <CardTitle>현재 등록된 필터 ({selectedList.length}/{MAX_ALLERGY_COUNT})</CardTitle>
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
      </Card>

      <Card>
        <CardTitle>전체 알러지 항목</CardTitle>
        <OptionGrid role="group" aria-label="알러지 유발 재료 목록">
          {ALLERGY_OPTIONS.map((option) => (
            <OptionLabel key={option}>
              <OptionCheckbox
                checked={isOptionChecked(option)}
                onChange={() => handleOptionToggle(option)}
              />
              {option}
            </OptionLabel>
          ))}
        </OptionGrid>
      </Card>

      <FooterRow>
        <Button onClick={handleSave} loading={isSaving} size="lg">
          필터 저장하기
        </Button>
      </FooterRow>
    </PageWrapper>
  );
}

export default AllergyManagePage;
