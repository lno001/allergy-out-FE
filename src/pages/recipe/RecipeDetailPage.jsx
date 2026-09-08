import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Modal from "../../components/common/Modal";
import { ToastContext } from "../../components/common/ToastProvider";
import { useAuth } from "../../hooks/useAuth";
import { deleteRecipe, getRecipe } from "../../apis/recipeApi";
import {
  EMPTY_TEXT,
  NUTRITION_FIELDS,
  isBlankValue,
} from "../../constants/recipe";
import {
  PageWrapper,
  TopBar,
  BackButton,
  Hero,
  HeroImage,
  HeroInfo,
  RecipeTitle,
  SpecRow,
  TypeBadge,
  MethodText,
  MainMaterial,
  RecipeTip,
  MetaRow,
  Author,
  AuthorAvatar,
  ViewCount,
  NutritionStrip,
  NutritionItem,
  NutritionLabel,
  NutritionValue,
  NutritionUnit,
  MaterialSection,
  SectionLabel,
  MaterialList,
  MaterialName,
  MaterialAmount,
  StepsSection,
  StepsHeading,
  StepList,
  StepItem,
  StepHead,
  StepNumber,
  StepText,
  StepImage,
  BottomActions,
  MessageBox,
  MessageText,
} from "./RecipeDetailPage.styled";

/**
 * RecipeDetailPage  (route: /recipe/:recipeNo — App.jsx <Route path="/recipe/:recipeNo">)
 * -----------------------------------------------------------------------------
 * 목록에서 레시피 카드를 클릭하면 들어오는 상세 화면.
 * useParams().recipeNo 로 번호를 받는다.
 * 명세: 조리법 상세 조회 V1.3 — GET /api/recipes/{recipeNo} (백엔드 URL은 복수)
 *
 * - 인증 안 함 (비회원도 볼 수 있음). 로그인 정보는 "수정/삭제" 버튼 노출 판단에만 사용.
 * - 헤더/푸터는 components/layout 담당. 라우트 등록(App.jsx)은 이번 범위 아님.
 * - props 없음 → @typedef(props) 두지 않음.
 */

/**
 * @typedef {Object} RecipeDetail
 * 규칙: *Img = 원본 파일명(표시용) / *ImgPath = S3 버킷 URL(<img src>).
 * @property {number}  recipeNo
 * @property {number}  memberNo          작성자 회원번호 (로그인 사용자와 비교해 수정/삭제 노출 판단)
 * @property {string}  recipeTitle
 * @property {string}  recipeInfo        요리 팁/설명
 * @property {string}  recipeMainImg     대표 이미지 원본 파일명 (src 에 쓰지 않음)
 * @property {string}  recipesImgPath    대표 이미지 S3 URL ← <img src>
 * @property {string}  memberName        작성자 이름
 * @property {string}  createDate        "YYYY-MM-DD"
 * @property {boolean} isBookmarked      현재 로그인 사용자의 즐겨찾기 여부 (현재 백엔드 false 고정)
 * @property {string}  recipeType        요리 종류 (밥/국&찌개/반찬/일품/후식/기타 — NOT NULL)
 * @property {string}  cookingMethod     조리 방법 (굽기/튀기기/볶기/찌기/끓이기/기타 — NOT NULL)
 * @property {(number|null)} calorie       칼로리(kcal). 단위는 프론트가 붙임
 * @property {(number|null)} carbohydrate  탄수화물(g)
 * @property {(number|null)} protein       단백질(g)
 * @property {(number|null)} fat           지방(g)
 * @property {(number|null)} sodium        나트륨(mg)
 * @property {(string|null)} mainMaterial  메인 재료 1개 (콤마 리스트 아님)
 * @property {number}  viewCount         조회수 — 상세 조회 1회당 서버가 +1
 */

/**
 * @typedef {Object} RecipeMaterial
 * @property {number} materialNo
 * @property {string} materialName
 * @property {string} amount
 */

/**
 * @typedef {Object} RecipeStep
 * @property {number} stepNo
 * @property {number} stepOrder
 * @property {string} stepInfo             조리 과정 설명
 * @property {(string|null)} stepImg       조리 과정 이미지 원본 파일명 (src 에 쓰지 않음)
 * @property {(string|null)} stepImgPath   조리 과정 이미지 S3 URL ← <img src> (없으면 null)
 */

/**
 * @typedef {Object} RecipeDetailResponse
 * GET /api/recipes/{recipeNo} 성공 응답의 data (명세 조리법 상세 조회 V1.3)
 * @property {RecipeDetail}     recipe
 * @property {RecipeMaterial[]} materials
 * @property {RecipeStep[]}     steps
 */

const RECIPE_LIST_PATH = "/recipe";

/** 날짜를 "2026년 8월 21일" 형태로 (파싱 실패 시 원본 그대로) */
const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

/** 이미지 로드 실패 시 숨김 (S3 버킷 비공개 이슈 대비) */
const hideBrokenImage = (event) => {
  event.currentTarget.style.visibility = "hidden";
};

function RecipeDetailPage() {
  const { recipeNo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const showToast = useContext(ToastContext);

  const [data, setData] = useState(
    /** @type {RecipeDetailResponse | null} */ (null),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(""); // 404("존재하지 않는 레시피입니다") 포함, 서버 msg 그대로

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await getRecipe(recipeNo);
        setData(res?.data ?? null);
      } catch (err) {
        // 인터셉터가 { code, msg, data, status } 로 reject → 서버 msg 그대로 (404 도 여기로)
        setError(err?.msg ?? "레시피를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [recipeNo]);

  // 삭제 — 확인 모달에서 "삭제" 클릭 시. 명세: DELETE /api/recipes/{recipeNo}
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteRecipe(recipeNo);
      showToast?.(res?.msg ?? "레시피 삭제 성공", "success");
      navigate(RECIPE_LIST_PATH, { replace: true }); // 삭제된 레시피로 뒤로가기 방지
    } catch (err) {
      // 401 로그인 필요 / 403 권한 없음 / 404 없는 레시피 / 500 — 서버 msg 그대로
      showToast?.(err?.msg ?? "레시피 삭제에 실패했습니다.", "danger");
      setIsDeleteOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper className="container">
        <Loading label="레시피를 불러오는 중" />
      </PageWrapper>
    );
  }

  // 에러(404 포함) 또는 데이터 없음 → 안내 + 목록으로
  if (error || !data) {
    return (
      <PageWrapper className="container">
        <MessageBox>
          <MessageText>{error || "레시피를 불러오지 못했습니다."}</MessageText>
          <Button variant="primary" onClick={() => navigate(RECIPE_LIST_PATH)}>
            목록으로
          </Button>
        </MessageBox>
      </PageWrapper>
    );
  }

  const { recipe, materials = [], steps = [] } = data;
  const orderedSteps = [...steps].sort(
    (a, b) => (a.stepOrder ?? 0) - (b.stepOrder ?? 0),
  );

  return (
    <PageWrapper className="container">
      <TopBar>
        <BackButton type="button" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </BackButton>
      </TopBar>

      {/* ---------------- 기본 정보 ---------------- */}
      <Hero>
        <HeroImage>
          {/* src 는 *ImgPath (S3 URL). recipeMainImg 는 원본 파일명이라 안 씀 */}
          <img
            src={recipe.recipesImgPath}
            alt={recipe.recipeTitle}
            onError={hideBrokenImage}
          />
        </HeroImage>

        <HeroInfo>
          <RecipeTitle>{recipe.recipeTitle}</RecipeTitle>

          {/* 요리 종류(뱃지) + 조리 방법(텍스트) — 백엔드 계약상 둘 다 NOT NULL.
              (필드 배포 전 응답엔 없을 수 있어 방어적으로 렌더) */}
          {(recipe.recipeType || recipe.cookingMethod) && (
            <SpecRow>
              {recipe.recipeType && <TypeBadge>{recipe.recipeType}</TypeBadge>}
              {recipe.cookingMethod && (
                <MethodText>{recipe.cookingMethod}</MethodText>
              )}
            </SpecRow>
          )}

          {/* 메인 재료 1개 — 없으면 "미입력" */}
          <MainMaterial>
            주재료 ·{" "}
            {isBlankValue(recipe.mainMaterial)
              ? EMPTY_TEXT
              : recipe.mainMaterial}
          </MainMaterial>

          {recipe.recipeInfo && <RecipeTip>{recipe.recipeInfo}</RecipeTip>}

          <MetaRow>
            <Author>
              <AuthorAvatar aria-hidden="true" />
              작성자 : {recipe.memberName}
            </Author>
            <span>작성일 : {formatDate(recipe.createDate)}</span>
            <ViewCount>
              조회수 {Number(recipe.viewCount ?? 0).toLocaleString()}
            </ViewCount>
          </MetaRow>
        </HeroInfo>
      </Hero>

      {/* ---------------- 영양성분 (5종 모두 nullable → 없으면 "미입력") ---------------- */}
      <NutritionStrip>
        {NUTRITION_FIELDS.map(({ key, label, unit }) => (
          <NutritionItem key={key}>
            <NutritionLabel>{label}</NutritionLabel>
            <NutritionValue>
              {isBlankValue(recipe[key]) ? (
                EMPTY_TEXT
              ) : (
                <>
                  {recipe[key]}
                  <NutritionUnit>{unit}</NutritionUnit>
                </>
              )}
            </NutritionValue>
          </NutritionItem>
        ))}
      </NutritionStrip>

      {/* ---------------- 재료 ---------------- */}
      <MaterialSection>
        <SectionLabel>재료</SectionLabel>
        <MaterialList>
          {materials.map((material) => (
            <li key={material.materialNo}>
              <MaterialName>{material.materialName}</MaterialName>
              <MaterialAmount>{material.amount}</MaterialAmount>
            </li>
          ))}
        </MaterialList>
      </MaterialSection>

      {/* ---------------- 조리 순서 ---------------- */}
      <StepsSection>
        <StepsHeading>조리 순서</StepsHeading>
        <StepList>
          {orderedSteps.map((step, index) => {
            const order = step.stepOrder ?? index + 1;
            const text = step.stepInfo ?? "";
            const stepImageUrl = step.stepImgPath; // S3 URL (stepImg 는 원본 파일명이라 안 씀)
            return (
              <StepItem key={step.stepNo ?? order}>
                <StepHead>
                  <StepNumber>{order}</StepNumber>
                  <StepText>{text}</StepText>
                </StepHead>
                {stepImageUrl && (
                  <StepImage>
                    <img
                      src={stepImageUrl}
                      alt={`조리 순서 ${order}단계`}
                      loading="lazy"
                      onError={hideBrokenImage}
                    />
                  </StepImage>
                )}
              </StepItem>
            );
          })}
        </StepList>
      </StepsSection>

      {/* ---------------- 작성자 액션 ----------------
          로그인 사용자 memberNo === 작성자 memberNo 일 때만 노출.
          실제 수정/삭제 권한은 PUT/DELETE API 에서 서버가 다시 검증한다(403). */}
      {user?.memberNo === recipe.memberNo && (
        <BottomActions>
          <Button variant="dangerOutline" onClick={() => setIsDeleteOpen(true)}>
            삭제하기
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/recipe/${recipe.recipeNo}/edit`)}
          >
            수정하기
          </Button>
        </BottomActions>
      )}

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="레시피 삭제"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeleting}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              삭제
            </Button>
          </>
        }
      >
        <p>이 레시피를 삭제하면 되돌릴 수 없습니다.</p>
        <p>삭제할까요?</p>
      </Modal>
    </PageWrapper>
  );
}

export default RecipeDetailPage;
