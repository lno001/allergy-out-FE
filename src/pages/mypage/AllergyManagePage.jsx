import { useContext } from "react";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import { ToastContext } from "../../components/common/ToastProvider";
import { useAllergyProfile } from "../../hooks/useAllergyProfile";
import { ALLERGY_OPTIONS } from "./allergyOptions";
import {
  FooterRow,
  OptionCheckbox,
  OptionGrid,
  OptionLabel,
  PageDescription,
  PageTitle,
  PageWrapper,
} from "./AllergyManagePage.styled";

/**
 * 마이페이지 > 알러지 필터 관리 (/mypage/allergy)
 * 식품알레르기 표시대상 원재료 체크박스 목록을 보여주고, "필터 저장하기"를 누르면
 * 현재 체크된 목록 전체를 서버에 저장한다 (PATCH /api/members/allergy, 전체 교체).
 */
function AllergyManagePage() {
  const showToast = useContext(ToastContext);
  const { selected, toggle, save, isLoading, isSaving, error } = useAllergyProfile();

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

  return (
    <PageWrapper>
      <PageTitle>알러지 필터 관리</PageTitle>
      <PageDescription>
        레시피 추천·검색에서 제외할 알러지 유발 재료를 선택해주세요.
      </PageDescription>

      {error && <Alert variant="danger">{error}</Alert>}

      <OptionGrid role="group" aria-label="알러지 유발 재료 목록">
        {ALLERGY_OPTIONS.map((option) => (
          <OptionLabel key={option}>
            <OptionCheckbox
              checked={selected.has(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </OptionLabel>
        ))}
      </OptionGrid>

      <FooterRow>
        <Button onClick={handleSave} loading={isSaving}>
          필터 저장하기
        </Button>
      </FooterRow>
    </PageWrapper>
  );
}

export default AllergyManagePage;
