import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import { useAuth } from "../../hooks/useAuth";
import { getRecipe } from "../../apis/recipeApi";
import {
  PageWrapper,
  TopBar,
  BackButton,
  Hero,
  HeroImage,
  HeroInfo,
  RecipeTitle,
  RecipeTip,
  MetaRow,
  Author,
  AuthorAvatar,
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
 * @property {string}  recipeTitle
 * @property {string}  recipeInfo        요리 팁/설명
 * @property {string}  recipeMainImg     대표 이미지 원본 파일명 (src 에 쓰지 않음)
 * @property {string}  recipesImgPath    대표 이미지 S3 URL ← <img src>
 * @property {string}  memberName        작성자 이름
 * @property {string}  createDate        "YYYY-MM-DD"
 * @property {boolean} isBookmarked      현재 로그인 사용자의 즐겨찾기 여부 (현재 백엔드 false 고정)
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

  const [data, setData] = useState(
    /** @type {RecipeDetailResponse | null} */ (null),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(""); // 404("존재하지 않는 레시피입니다") 포함, 서버 msg 그대로

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
          <img src={recipe.recipesImgPath} alt={recipe.recipeTitle} onError={hideBrokenImage} />
        </HeroImage>

        <HeroInfo>
          <RecipeTitle>{recipe.recipeTitle}</RecipeTitle>
          {recipe.recipeInfo && <RecipeTip>{recipe.recipeInfo}</RecipeTip>}

          <MetaRow>
            <Author>
              <AuthorAvatar aria-hidden="true" />
              작성자 : {recipe.memberName}
            </Author>
            <span>작성일 : {formatDate(recipe.createDate)}</span>
          </MetaRow>
        </HeroInfo>
      </Hero>

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
          명세 V1.3 은 "내 글인지" 판단할 데이터(memberNo/isOwner)를 안 주므로,
          지금은 "로그인 상태"에서만 노출한다. 백엔드가 isOwner 를 주면 그 기준으로 교체 필요. */}
      {user && (
        <BottomActions>
          <Button variant="dangerOutline" disabled title="삭제 기능 준비 중">
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
    </PageWrapper>
  );
}

export default RecipeDetailPage;
