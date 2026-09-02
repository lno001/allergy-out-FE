import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Loading from "../../components/common/Loading";
import { ToastContext } from "../../components/common/ToastProvider";
import { useAuth } from "../../hooks/useAuth";
import { getRecipe, updateRecipe } from "../../apis/recipeApi";
import {
  PageWrapper,
  PageHeader,
  PageHeading,
  BackButton,
  FormBody,
  SectionCard,
  SectionTitle,
  Field,
  FieldLabelRow,
  FieldLabelText,
  RequiredMark,
  HelperRow,
  CharCount,
  TextArea,
  MaterialList,
  MaterialRow,
  TextInput,
  IconButton,
  AddRowButton,
  ImageDropzone,
  DropzoneIcon,
  DropzoneText,
  DropzoneHint,
  ImagePreviewBox,
  PreviewButtonRow,
  ImageChangeButton,
  StepList,
  StepItem,
  StepItemHeader,
  StepOrderBadge,
  StepItemTitle,
  StepImageLabel,
  FormActions,
} from "./recipeForm.styled";

/**
 * RecipeEditPage  (route: /recipe/:recipeNo/edit — 작성자 본인만)
 * -----------------------------------------------------------------------------
 * 상세 화면의 "수정하기"로 진입. 기존 값을 폼에 채우고 PATCH /api/recipes/{recipeNo} 로 저장.
 * 등록 폼(RecipeCreatePage)과 UI 동일 — styled 는 recipeForm.styled 공용.
 *
 * 등록과 다른 4가지 (프론트 스펙):
 *  1) 재료/단계에 PK 실어 보냄 — materialList[i].materialNo / stepList[i].stepNo
 *     (기존이면 값, 새로 추가면 미전송 = 신규)
 *  2) 삭제 = 요청 리스트에서 빼기 (백엔드가 "DB엔 있는데 요청에 없는 번호 = 삭제")
 *  3) 대표 이미지 — 교체했을 때만 recipeMainImg 전송 (필수라 삭제 없음)
 *  4) 단계 이미지 — 유지(미전송) / 교체(stepImg 파일) / 삭제(removeStepImg=true) / 신규+사진(stepImg)
 *  + stepOrder = 최종 배열 순서 1..N
 *
 * 라우트 등록(App.jsx)은 이번 범위 밖. props 없음.
 */

/**
 * @typedef {Object} RecipeUpdateRequest
 * multipart/form-data 폼 필드 (camelCase — 명세서 대문자 표기 무시).
 * @property {string} recipeTitle
 * @property {string} recipeInfo
 * @property {File}   [recipeMainImg]                              대표 이미지 (교체 시에만)
 * @property {{ materialNo?: number, materialName: string, amount: string }[]} materialList
 * @property {{ stepNo?: number, stepOrder: number, stepInfo: string, stepImg?: File, removeStepImg?: "true" }[]} stepList
 */

/**
 * @typedef {Object} ApiEnvelope
 * @property {number} code
 * @property {string} msg
 * @property {null}   data
 */

const FIELD_MAX_LENGTH = {
  recipeTitle: 50,
  recipeInfo: 1000,
  materialName: 30,
  amount: 30,
  stepInfo: 2000,
};
const MAX_LIST_ITEMS = 20; // 재료 / 조리 단계 각각의 상한
const IMAGE_MIME_TYPES = ["image/png", "image/jpeg"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

const emptyMaterial = () => ({ materialNo: null, materialName: "", amount: "" });
const emptyStep = () => ({
  stepNo: null,
  stepInfo: "",
  stepImgFile: null, // 새로 고른 파일
  stepImgPreview: "", // 기존 URL 또는 새 objectURL, "" 이면 이미지 없음
  removeStepImg: false, // 있던 이미지를 지웠는지
});

/** 이미지 파일 검사 — 문구는 명세 그대로. 통과 시 null. */
const validateImageFile = (file) => {
  if (!IMAGE_MIME_TYPES.includes(file.type)) return "이미지 형식은 PNG, JPG만 지원합니다.";
  if (file.size > MAX_IMAGE_BYTES) return "이미지 파일은 5MB를 초과할 수 없습니다";
  return null;
};

function RecipeEditPage() {
  const { recipeNo } = useParams();
  const navigate = useNavigate();
  const { user, isReady } = useAuth();
  const showToast = useContext(ToastContext);
  const mainImageInputRef = useRef(null);
  const objectUrlsRef = useRef([]); // 만든 objectURL 모음 — 언마운트 시 일괄 해제

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [authorMemberNo, setAuthorMemberNo] = useState(null); // 작성자 판별용

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeInfo, setRecipeInfo] = useState("");
  const [mainImageFile, setMainImageFile] = useState(null); // null = 미변경
  const [mainImagePreview, setMainImagePreview] = useState(""); // 기존 URL 또는 새 objectURL
  const [materials, setMaterials] = useState([]);
  const [steps, setSteps] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detailPath = `/recipe/${recipeNo}`;

  // 기존 값 로드 (상세 조회 재사용)
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const res = await getRecipe(recipeNo);
        const data = res?.data ?? {};
        const recipe = data.recipe ?? {};
        setAuthorMemberNo(recipe.memberNo ?? null);
        setRecipeTitle(recipe.recipeTitle ?? "");
        setRecipeInfo(recipe.recipeInfo ?? "");
        setMainImagePreview(recipe.recipesImgPath ?? "");
        setMaterials(
          (data.materials ?? []).map((m) => ({
            materialNo: m.materialNo,
            materialName: m.materialName ?? "",
            amount: m.amount ?? "",
          })),
        );
        setSteps(
          [...(data.steps ?? [])]
            .sort((a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0))
            .map((s) => ({
              stepNo: s.stepNo,
              stepInfo: s.stepInfo ?? "",
              stepImgFile: null,
              stepImgPreview: s.stepImgPath ?? "",
              removeStepImg: false,
            })),
        );
      } catch (err) {
        setLoadError(err?.msg ?? "레시피를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [recipeNo]);

  useEffect(() => () => objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  // 작성자 본인이 아니면 상세로 돌려보낸다 (URL 직접 접근 차단).
  // authorMemberNo 가 아직 null(백엔드 미제공)이면 게이트 미적용 — 저장 시 서버 403 이 최종 방어.
  useEffect(() => {
    if (isLoading || !isReady || loadError || authorMemberNo == null) return;
    if (user?.memberNo !== authorMemberNo) {
      navigate(`/recipe/${recipeNo}`, { replace: true });
    }
  }, [isLoading, isReady, loadError, authorMemberNo, user, navigate, recipeNo]);

  const trackPreview = (file) => {
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    return url;
  };

  /** 배열 state 의 index 행에서 patch 필드만 교체 (재료·단계 공용) */
  const updateRow = (setRows, index, patch) =>
    setRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  // ---- 대표 이미지 (교체만) ----
  const handleSelectMainImage = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setSubmitError(error);
      return;
    }
    setSubmitError("");
    setMainImageFile(file);
    setMainImagePreview(trackPreview(file));
  };

  // ---- 단계 이미지 (교체 / 삭제) ----
  const handleSelectStepImage = (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      setSubmitError(`${index + 1}번째 조리 단계: ${error}`);
      return;
    }
    setSubmitError("");
    updateRow(setSteps, index, {
      stepImgFile: file,
      stepImgPreview: trackPreview(file),
      removeStepImg: false,
    });
  };

  const handleRemoveStepImage = (index) =>
    updateRow(setSteps, index, { stepImgFile: null, stepImgPreview: "", removeStepImg: true });

  // ---- 제출 ----
  const handleSubmit = async (event) => {
    event.preventDefault();
    // 공용 <Input> 은 native required 를 안 넘겨서 제목만 직접 확인 (나머지는 <input required>)
    if (!recipeTitle.trim()) {
      setSubmitError("요리 제목은 필수입니다.");
      return;
    }
    setSubmitError("");

    const formData = new FormData();
    formData.append("recipeTitle", recipeTitle.trim());
    formData.append("recipeInfo", recipeInfo.trim());
    if (mainImageFile) formData.append("recipeMainImg", mainImageFile); // 교체했을 때만

    materials.forEach((material, i) => {
      if (material.materialNo != null) {
        formData.append(`materialList[${i}].materialNo`, String(material.materialNo));
      }
      formData.append(`materialList[${i}].materialName`, material.materialName.trim());
      formData.append(`materialList[${i}].amount`, material.amount.trim());
    });

    steps.forEach((step, i) => {
      if (step.stepNo != null) formData.append(`stepList[${i}].stepNo`, String(step.stepNo));
      formData.append(`stepList[${i}].stepOrder`, String(i + 1)); // 최종 배열 순서 1..N
      formData.append(`stepList[${i}].stepInfo`, step.stepInfo.trim());
      if (step.stepImgFile) {
        formData.append(`stepList[${i}].stepImg`, step.stepImgFile); // 교체 / 신규
      } else if (step.removeStepImg && step.stepNo != null) {
        formData.append(`stepList[${i}].removeStepImg`, "true"); // 기존 이미지 삭제
      }
      // 둘 다 아니면 미전송 = 유지
    });

    setIsSubmitting(true);
    try {
      /** @type {ApiEnvelope} */
      const res = await updateRecipe(recipeNo, formData);
      showToast?.(res?.msg ?? "레시피 수정 성공했습니다.", "success");
      // 수정 완료 후 바뀐 내용을 바로 보도록 상세로. replace 라서 뒤로가기 눌러도 수정폼으로 안 돌아감
      navigate(detailPath, { replace: true });
    } catch (err) {
      // 400 유효성 / 401 미로그인 / 403 본인 아님 / 404 없는 레시피 / 500 — msg 그대로
      setSubmitError(err?.msg ?? "레시피 수정에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 취소는 상세보기로. replace 라서 상세에서 뒤로가기 눌러도 수정폼으로 안 돌아감
  const handleCancel = () => navigate(detailPath, { replace: true });

  if (isLoading || !isReady) {
    return (
      <PageWrapper className="container">
        <Loading label="레시피를 불러오는 중" />
      </PageWrapper>
    );
  }

  if (loadError) {
    return (
      <PageWrapper className="container">
        <Alert variant="danger">{loadError}</Alert>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="container">
      <PageHeader>
        <PageHeading>레시피 수정</PageHeading>
        <BackButton type="button" onClick={handleCancel}>
          ← 취소
        </BackButton>
      </PageHeader>

      {submitError && (
        <Alert variant="danger" onClose={() => setSubmitError("")}>
          {submitError}
        </Alert>
      )}

      <FormBody onSubmit={handleSubmit}>
        {/* ---------------- 기본 정보 ---------------- */}
        <SectionCard>
          <SectionTitle>기본 정보</SectionTitle>

          <Input
            label="요리 제목"
            required
            value={recipeTitle}
            maxLength={FIELD_MAX_LENGTH.recipeTitle}
            onChange={(e) => setRecipeTitle(e.target.value)}
          />

          <Field>
            <FieldLabelRow>
              <FieldLabelText htmlFor="recipe-info">요리 설명</FieldLabelText>
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </FieldLabelRow>
            <TextArea
              id="recipe-info"
              required
              rows={4}
              value={recipeInfo}
              maxLength={FIELD_MAX_LENGTH.recipeInfo}
              onChange={(e) => setRecipeInfo(e.target.value)}
            />
            <HelperRow>
              <span />
              <CharCount>
                {recipeInfo.length} / {FIELD_MAX_LENGTH.recipeInfo}
              </CharCount>
            </HelperRow>
          </Field>

          <Field>
            <FieldLabelRow>
              <FieldLabelText>필요 재료</FieldLabelText>
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </FieldLabelRow>

            <MaterialList>
              {materials.map((material, index) => (
                <MaterialRow key={material.materialNo ?? `new-${index}`}>
                  <TextInput
                    type="text"
                    required
                    placeholder="재료 이름"
                    aria-label={`${index + 1}번째 재료 이름`}
                    value={material.materialName}
                    maxLength={FIELD_MAX_LENGTH.materialName}
                    onChange={(e) => updateRow(setMaterials, index, { materialName: e.target.value })}
                  />
                  <TextInput
                    type="text"
                    required
                    placeholder="양 (예: 200g)"
                    aria-label={`${index + 1}번째 재료 양`}
                    value={material.amount}
                    maxLength={FIELD_MAX_LENGTH.amount}
                    onChange={(e) => updateRow(setMaterials, index, { amount: e.target.value })}
                  />
                  <IconButton
                    type="button"
                    onClick={() => setMaterials((rows) => rows.filter((_, i) => i !== index))}
                    disabled={materials.length <= 1}
                    aria-label={`${index + 1}번째 재료 삭제`}
                  >
                    ✕
                  </IconButton>
                </MaterialRow>
              ))}
            </MaterialList>

            <AddRowButton
              type="button"
              onClick={() => setMaterials((rows) => [...rows, emptyMaterial()])}
              disabled={materials.length >= MAX_LIST_ITEMS}
            >
              + 재료 추가{" "}
              {materials.length >= MAX_LIST_ITEMS && `(최대 ${MAX_LIST_ITEMS}개)`}
            </AddRowButton>
          </Field>
        </SectionCard>

        {/* ---------------- 조리 단계 & 이미지 ---------------- */}
        <SectionCard>
          <SectionTitle>조리 단계 &amp; 이미지</SectionTitle>

          <Field>
            <FieldLabelRow>
              <FieldLabelText>대표 이미지</FieldLabelText>
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </FieldLabelRow>

            {mainImagePreview ? (
              <ImagePreviewBox>
                <img src={mainImagePreview} alt="대표 이미지 미리보기" />
                <PreviewButtonRow>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => mainImageInputRef.current?.click()}
                  >
                    변경
                  </Button>
                </PreviewButtonRow>
              </ImagePreviewBox>
            ) : (
              <ImageDropzone type="button" onClick={() => mainImageInputRef.current?.click()}>
                <DropzoneIcon aria-hidden="true">＋</DropzoneIcon>
                <DropzoneText>클릭하여 대표 이미지 등록</DropzoneText>
                <DropzoneHint>PNG, JPG · 5MB 이하</DropzoneHint>
              </ImageDropzone>
            )}
            <input
              ref={mainImageInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="visually-hidden"
              onChange={handleSelectMainImage}
            />
          </Field>

          <Field>
            <FieldLabelRow>
              <FieldLabelText>조리 순서</FieldLabelText>
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </FieldLabelRow>

            <StepList>
              {steps.map((step, index) => (
                <StepItem key={step.stepNo ?? `new-${index}`}>
                  <StepItemHeader>
                    <StepOrderBadge>{index + 1}</StepOrderBadge>
                    <StepItemTitle>{index + 1}번째 조리 단계</StepItemTitle>
                    <IconButton
                      type="button"
                      onClick={() => setSteps((rows) => rows.filter((_, i) => i !== index))}
                      disabled={steps.length <= 1}
                      aria-label={`${index + 1}번째 조리 단계 삭제`}
                    >
                      ✕
                    </IconButton>
                  </StepItemHeader>

                  <TextArea
                    required
                    rows={3}
                    aria-label={`${index + 1}번째 조리 과정 설명`}
                    value={step.stepInfo}
                    maxLength={FIELD_MAX_LENGTH.stepInfo}
                    onChange={(e) => updateRow(setSteps, index, { stepInfo: e.target.value })}
                  />
                  <HelperRow>
                    <span />
                    <CharCount>
                      {step.stepInfo.length} / {FIELD_MAX_LENGTH.stepInfo}
                    </CharCount>
                  </HelperRow>

                  {step.stepImgPreview ? (
                    <ImagePreviewBox>
                      <img src={step.stepImgPreview} alt={`${index + 1}번째 조리 단계 이미지 미리보기`} />
                      <PreviewButtonRow>
                        <ImageChangeButton>
                          변경
                          <input
                            type="file"
                            accept="image/png,image/jpeg"
                            className="visually-hidden"
                            onChange={(e) => handleSelectStepImage(index, e)}
                          />
                        </ImageChangeButton>
                        <Button variant="dangerOutline" size="sm" onClick={() => handleRemoveStepImage(index)}>
                          이미지 삭제
                        </Button>
                      </PreviewButtonRow>
                    </ImagePreviewBox>
                  ) : (
                    <StepImageLabel>
                      ＋ 단계 사진 첨부 (선택)
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="visually-hidden"
                        onChange={(e) => handleSelectStepImage(index, e)}
                      />
                    </StepImageLabel>
                  )}
                </StepItem>
              ))}
            </StepList>

            <AddRowButton
              type="button"
              onClick={() => setSteps((rows) => [...rows, emptyStep()])}
              disabled={steps.length >= MAX_LIST_ITEMS}
            >
              + 조리 단계 추가 {steps.length >= MAX_LIST_ITEMS && `(최대 ${MAX_LIST_ITEMS}개)`}
            </AddRowButton>
          </Field>
        </SectionCard>

        <FormActions>
          <Button variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            수정 완료
          </Button>
        </FormActions>
      </FormBody>
    </PageWrapper>
  );
}

export default RecipeEditPage;
