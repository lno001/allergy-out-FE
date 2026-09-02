import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { ToastContext } from "../../components/common/ToastProvider";
import { createRecipe } from "../../apis/recipeApi";
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
  StepList,
  StepItem,
  StepItemHeader,
  StepOrderBadge,
  StepItemTitle,
  StepImageLabel,
  FormActions,
} from "./RecipeCreatePage.styled";

/**
 * RecipeCreatePage  (route: /recipe/form, 권한: 회원 / ROLE_USER)
 * -----------------------------------------------------------------------------
 * 회원이 자신의 레시피를 등록하는 화면. 레시피 전체조회 화면(미구현)의
 * "레시피 등록하기" 버튼으로 진입해 명세(레시피등록 V1.8) 항목을 입력 → POST /api/recipes.
 *
 * - 필수/글자수 검증은 <input required maxLength>(브라우저 네이티브)에 맡긴다.
 *   공용 <Input> 은 required 를 네이티브로 넘기지 않고, 대표 이미지는 숨긴 input 이라
 *   이 둘만 handleSubmit 에서 직접 확인한다.
 * - 이미지 형식/용량은 코드로 검사해 상단 배너로 안내한다 (문구는 명세 V1.8 그대로).
 * - 헤더/푸터는 components/layout 담당. 라우트 연결(App.jsx)은 이번 범위 아님.
 */

/**
 * @typedef {Object} RecipeCreateRequest
 * multipart/form-data 로 전송되는 논리적 필드 구조 (명세 레시피등록 V1.8).
 * @property {string} recipeTitle
 * @property {string} recipeInfo
 * @property {File}   RECIPE_MAIN_IMG
 * @property {{ materialName: string, amount: string }[]}            materialList
 * @property {{ stepOrder: number, stepInfo: string, stepImg?: File }[]} stepList
 */

/**
 * @typedef {Object} ApiEnvelope
 * axiosInstance 인터셉터가 response.data(=봉투)로 언랩해 돌려준다.
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
const MAX_LIST_ITEMS = 20; // materialList / stepList 각각의 최대 개수
const IMAGE_MIME_TYPES = ["image/png", "image/jpeg"]; // JPG === image/jpeg
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const RECIPE_LIST_PATH = "/recipe"; // 등록 성공/취소 후 이동 (레시피 목록 — 미구현)

const emptyMaterial = () => ({ materialName: "", amount: "" });
const emptyStep = () => ({ stepInfo: "", stepImg: null, stepImgPreview: "" });

/** 이미지 파일 검사 — 문구는 명세(V1.8) 그대로. 통과 시 null. */
const validateImageFile = (file) => {
  if (!IMAGE_MIME_TYPES.includes(file.type))
    return "이미지 형식은 PNG, JPG만 지원합니다.";
  if (file.size > MAX_IMAGE_BYTES)
    return "이미지 파일은 5MB를 초과할 수 없습니다";
  return null;
};

function RecipeCreatePage() {
  const navigate = useNavigate();
  const showToast = useContext(ToastContext);
  const mainImageInputRef = useRef(null);
  const previewUrlsRef = useRef([]); // 만든 objectURL 모음 — 페이지 벗어날 때 일괄 해제

  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeInfo, setRecipeInfo] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [materials, setMaterials] = useState([emptyMaterial()]);
  const [steps, setSteps] = useState([emptyStep()]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect는 들어올때 실행되는 것으로 알고있었는데 나갈때도 실행됨
  // 함수를 리턴해서 나갈때 실행되는 코드를 작성
  // previewIsRef는 미리보기 이미지 URL들을 지워줌
  useEffect(
    () => () => previewUrlsRef.current.forEach(URL.revokeObjectURL),
    [],
  );

  /** 배열 state 의 index 행에서 patch 필드만 갈아끼운다 (재료·단계 공용) */
  const updateRow = (setRows, index, patch) =>
    setRows((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );

  /** <input type=file> 에서 이미지 하나 읽어 검증 → { file, url } 또는 null */
  const readImageFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // 같은 파일 재선택도 감지되도록
    if (!file) return null;

    const error = validateImageFile(file);
    if (error) {
      setSubmitError(error);
      return null;
    }
    setSubmitError("");

    const url = URL.createObjectURL(file);
    previewUrlsRef.current.push(url);
    return { file, url };
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // 네이티브 검증(required/maxLength)을 통과해야 여기 도달

    // <Input>(제목)·숨긴 파일 input(대표 이미지)은 네이티브 검증이 안 걸려 직접 확인
    if (!recipeTitle.trim() || !mainImage) {
      setSubmitError("요리 제목과 대표 이미지는 필수입니다.");
      return;
    }
    setSubmitError("");

    // 명세 키 순서대로 FormData 구성 (레시피등록 V1.8 "요청 데이터 형식")
    const formData = new FormData();
    formData.append("recipeTitle", recipeTitle.trim());
    formData.append("recipeInfo", recipeInfo.trim());
    formData.append("RECIPE_MAIN_IMG", mainImage);
    materials.forEach((m, i) => {
      formData.append(`materialList[${i}].materialName`, m.materialName.trim());
      formData.append(`materialList[${i}].amount`, m.amount.trim());
    });
    steps.forEach((s, i) => {
      formData.append(`stepList[${i}].stepOrder`, String(i + 1)); // 화면 순서 = 조리 순서
      formData.append(`stepList[${i}].stepInfo`, s.stepInfo.trim());
      if (s.stepImg) formData.append(`stepList[${i}].stepImg`, s.stepImg);
    });

    setIsSubmitting(true);
    try {
      /** @type {ApiEnvelope} */
      const result = await createRecipe(formData);
      showToast?.(result?.msg ?? "레시피 등록 성공했습니다.", "success");
      navigate(RECIPE_LIST_PATH);
    } catch (error) {
      // 인터셉터가 { code, msg, data, status } 로 reject → 서버 msg 그대로 노출
      setSubmitError(error?.msg ?? "레시피 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // .container = GlobalStyle 의 max-width + 가운데 정렬 + 좌우 패딩 유틸.
    // 상위에 layout(Header/Footer)이 생기면 그쪽에서 감싸므로 이 className 은 뺀다.
    <PageWrapper className="container">
      <PageHeader>
        <PageHeading>레시피 등록</PageHeading>
        <BackButton type="button" onClick={() => navigate(RECIPE_LIST_PATH)}>
          ← 목록으로
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
            placeholder="예: 두부 된장국"
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
              placeholder="요리에 대한 설명이나 팁을 적어주세요."
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
                <MaterialRow key={index}>
                  <TextInput
                    type="text"
                    required
                    placeholder="재료 이름"
                    aria-label={`${index + 1}번째 재료 이름`}
                    value={material.materialName}
                    maxLength={FIELD_MAX_LENGTH.materialName}
                    onChange={(e) =>
                      updateRow(setMaterials, index, {
                        materialName: e.target.value,
                      })
                    }
                  />
                  <TextInput
                    type="text"
                    required
                    placeholder="양 (예: 200g)"
                    aria-label={`${index + 1}번째 재료 양`}
                    value={material.amount}
                    maxLength={FIELD_MAX_LENGTH.amount}
                    onChange={(e) =>
                      updateRow(setMaterials, index, { amount: e.target.value })
                    }
                  />
                  <IconButton
                    type="button"
                    onClick={() =>
                      setMaterials((rows) => rows.filter((_, i) => i !== index))
                    }
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
              {materials.length >= MAX_LIST_ITEMS &&
                `(최대 ${MAX_LIST_ITEMS}개)`}
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
                <img src={mainImagePreview} alt="등록할 대표 이미지 미리보기" />
                <PreviewButtonRow>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => mainImageInputRef.current?.click()}
                  >
                    변경
                  </Button>
                  <Button
                    variant="dangerOutline"
                    size="sm"
                    onClick={() => {
                      setMainImage(null);
                      setMainImagePreview("");
                    }}
                  >
                    삭제
                  </Button>
                </PreviewButtonRow>
              </ImagePreviewBox>
            ) : (
              <ImageDropzone
                type="button"
                onClick={() => mainImageInputRef.current?.click()}
              >
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
              onChange={(e) => {
                const picked = readImageFile(e);
                if (picked) {
                  setMainImage(picked.file);
                  setMainImagePreview(picked.url);
                }
              }}
            />
          </Field>

          <Field>
            <FieldLabelRow>
              <FieldLabelText>조리 순서</FieldLabelText>
              <RequiredMark aria-hidden="true">*</RequiredMark>
            </FieldLabelRow>

            <StepList>
              {steps.map((step, index) => (
                <StepItem key={index}>
                  <StepItemHeader>
                    <StepOrderBadge>{index + 1}</StepOrderBadge>
                    <StepItemTitle>{index + 1}번째 조리 단계</StepItemTitle>
                    <IconButton
                      type="button"
                      onClick={() =>
                        setSteps((rows) => rows.filter((_, i) => i !== index))
                      }
                      disabled={steps.length <= 1}
                      aria-label={`${index + 1}번째 조리 단계 삭제`}
                    >
                      ✕
                    </IconButton>
                  </StepItemHeader>

                  <TextArea
                    required
                    rows={3}
                    placeholder="이 단계에서 무엇을 하는지 적어주세요."
                    aria-label={`${index + 1}번째 조리 과정 설명`}
                    value={step.stepInfo}
                    maxLength={FIELD_MAX_LENGTH.stepInfo}
                    onChange={(e) =>
                      updateRow(setSteps, index, { stepInfo: e.target.value })
                    }
                  />
                  <HelperRow>
                    <span />
                    <CharCount>
                      {step.stepInfo.length} / {FIELD_MAX_LENGTH.stepInfo}
                    </CharCount>
                  </HelperRow>

                  {step.stepImgPreview ? (
                    <ImagePreviewBox>
                      <img
                        src={step.stepImgPreview}
                        alt={`${index + 1}번째 조리 단계 이미지 미리보기`}
                      />
                      <Button
                        variant="dangerOutline"
                        size="sm"
                        onClick={() =>
                          updateRow(setSteps, index, {
                            stepImg: null,
                            stepImgPreview: "",
                          })
                        }
                      >
                        이미지 삭제
                      </Button>
                    </ImagePreviewBox>
                  ) : (
                    <StepImageLabel>
                      ＋ 단계 사진 첨부 (선택)
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="visually-hidden"
                        onChange={(e) => {
                          const picked = readImageFile(e);
                          if (picked) {
                            updateRow(setSteps, index, {
                              stepImg: picked.file,
                              stepImgPreview: picked.url,
                            });
                          }
                        }}
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
              + 조리 단계 추가{" "}
              {steps.length >= MAX_LIST_ITEMS && `(최대 ${MAX_LIST_ITEMS}개)`}
            </AddRowButton>
          </Field>
        </SectionCard>

        <FormActions>
          <Button
            variant="secondary"
            onClick={() => navigate(RECIPE_LIST_PATH)}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            레시피 등록하기
          </Button>
        </FormActions>
      </FormBody>
    </PageWrapper>
  );
}

export default RecipeCreatePage;
