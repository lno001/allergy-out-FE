import { useEffect, useRef, useState } from "react";
import { Link, useNavigationType } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../hooks/useAuth";
import { getFilteredRecipes } from "../../apis/recipeApi";
import FilterModal from "./FilterModal";
import {
  PageWrapper,
  RecommendSection,
  FeaturedCarousel,
  CarouselArrow,
  CarouselDots,
  CarouselDot,
  FeaturedCard,
  FeaturedThumb,
  FeaturedThumbFallback,
  FeaturedBody,
  FeaturedEyebrow,
  FeaturedTitle,
  FeaturedSpecRow,
  FeaturedSpec,
  FeaturedSummary,
  FeaturedIngredient,
  FeaturedMeta,
  Toolbar,
  ToolbarRow,
  ToolbarGroup,
  ToolbarEnd,
  RegisterButton,
  SortToggle,
  SortOption,
  CategoryRow,
  RowDivider,
  PresetGroup,
  PresetTile,
  PresetThumb,
  PresetLabel,
  CategoryBar,
  CategoryCard,
  CategoryThumb,
  CategoryLabel,
  SearchForm,
  SearchInput,
  SearchSubmit,
  ContentArea,
  RecipeGrid,
  RecipeCard,
  CardThumb,
  CardBody,
  CardTitle,
  CardSpecRow,
  CardSpec,
  CardDifficulty,
  CardMainIngredient,
  CardMeta,
  EmptyState,
  EmptyText,
  PaginationWrap,
} from "./RecipeListPage.styled";

/**
 * RecipeListPage  (route: /recipe — App.jsx <Route path="/recipe">)
 * -----------------------------------------------------------------------------
 * 회원·비회원이 레시피(조리법) 게시판에 들어왔을 때 목록을 보여주는 화면.
 * 조회는 GET /api/recipes/filter 하나로 통일 — 검색어(keyword) + 알레르기 제외
 * 필터(excludeMaterials) + 페이지네이션을 한 번에 받는다.
 *
 * 화면 구성 (1차 레이아웃):
 *  1) 오늘의 추천 레시피 — 큰 카드 1개. 백엔드 추천 API 전이라 예시 데이터 하드코딩.
 *  2) 툴바
 *     - 1행: [필터] [최신순/인기순] [카테고리 칩] ... [조리법 등록하기]
 *     - 2행: 가운데 정렬된 검색창 (검색 버튼 없이 엔터로 검색)
 *     - "인기순" · "카테고리" 는 백엔드 미지원. 인기순은 비활성, 카테고리는 배선만 완성(파라미터는 무시됨).
 *  3) 카드 그리드 4열, 한 페이지 8개(PAGE_SIZE).
 *
 * - 인증: 회원이면 토큰이 자동 첨부되어 백엔드가 본인 알러지 재료를 뺀 목록을 준다.
 * - 검색: 검색창 + "검색" 버튼(또는 엔터). keyword 가 비면 파라미터를 빼서 전체 조회.
 * - 필터: "필터" 버튼 → FilterModal 에서 제외할 재료명을 고르고 "적용하기".
 *   적용된 개수는 "필터 (N)" 로만 표시하고, 변경은 모달을 다시 열어서 한다.
 * - 조회는 submit·페이지 이동·필터 적용 시점에 loadRecipes(page, keyword, excludeMaterials) 직접 호출.
 * - 상세 → 뒤로가기(브라우저 back)로 돌아오면 보던 페이지·검색어·필터를 그대로 복원한다
 *   (sessionStorage + useNavigationType. 헤더 링크로 새로 들어오면 복원 안 함).
 * - 헤더/푸터는 components/layout 담당. props 없음.
 */

/**
 * @typedef {Object} RecipeListItem
 * @property {number} recipeNo
 * @property {string} recipeTitle
 * @property {string} recipeMainImg    대표 이미지 "원본 파일명" (표시용, src 에 쓰지 않음)
 * @property {string} recipesImgPath   대표 이미지 S3 URL ← <img src>
 * @property {string} memberName      작성자 이름
 * @property {string} createDate      "YYYY-MM-DD"
 */

/**
 * @typedef {Object} RecipeListResponse
 * GET /api/recipes/filter 성공 응답의 data
 * @property {RecipeListItem[]} recipes
 * @property {{ page:number, size:number, offset:number, totalElements:number, totalPages:number }} pageInfo
 */

const PAGE_SIZE = 8; // 4열 × 2행
const RECIPE_FORM_PATH = "/recipe/form"; // 조리법 등록 화면

/**
 * 목록 화면 상태(페이지·검색어·필터·카테고리·프리셋)를 sessionStorage 에 저장/복원.
 * 상세 → 뒤로가기(브라우저 back) 로 돌아왔을 때 보던 페이지 그대로 복원하기 위함.
 * (헤더의 "레시피 조회" 로 새로 들어오면 복원하지 않는다 — useNavigationType 으로 구분)
 */
const LIST_STATE_KEY = "recipeList:lastView";

const readListState = () => {
  try {
    return JSON.parse(sessionStorage.getItem(LIST_STATE_KEY) || "null");
  } catch {
    return null;
  }
};

const writeListState = (state) => {
  try {
    sessionStorage.setItem(LIST_STATE_KEY, JSON.stringify(state));
  } catch {
    // 시크릿 모드 등에서 sessionStorage 접근 불가 — 복원 없이 동작 (기능상 문제 없음)
  }
};

/**
 * 레시피 카테고리 — 1차 예시(틀만).
 * 텍스트를 읽기 전에 "아 이런 종류구나" 하고 눈에 들어오게 각 카테고리에 예시 비주얼을 붙인다.
 * 지금은 이모지로 자리만 잡고, 나중에 대표 이미지(썸네일)로 교체한다.
 * 백엔드에 카테고리 컬럼 + /filter 의 category 파라미터가 생기면 key 기준을 맞춘다.
 * "전체" 는 카테고리 미적용(파라미터 생략).
 */
const RECIPE_CATEGORIES = [
  { key: "전체", emoji: "🍽️" },
  { key: "밥", emoji: "🍚" },
  { key: "국·찌개", emoji: "🍲" },
  { key: "반찬", emoji: "🥗" },
  { key: "고기", emoji: "🥩" },
  { key: "면", emoji: "🍜" },
  { key: "채소", emoji: "🥬" },
  { key: "해산물", emoji: "🦐" },
  { key: "후식", emoji: "🍰" },
];
const ALL_CATEGORY = RECIPE_CATEGORIES[0].key;

/**
 * 빠른 필터 프리셋 — 원클릭으로 켜고 끄는 조건 (여러 개 동시 가능).
 * 백엔드 /filter 에 해당 조건 파라미터가 없어서 지금은 UI + 배선만.
 * key 가 그대로 params.presets 로 나가고, 백엔드가 처리하게 되면 바로 동작한다.
 */
const RECIPE_PRESETS = [
  { key: "quick", emoji: "⚡", label: "초스피드" }, // 조리시간 ≤ 10분
  { key: "fewIngredients", emoji: "🥕", label: "간단재료" }, // 재료 ≤ 3개
  { key: "beginner", emoji: "🔰", label: "초보환영" }, // 난이도 = 쉬움
  { key: "popular", emoji: "🔥", label: "주간인기" }, // 최근 7일 인기
];

/**
 * 카드에 보여줄 조리시간/난이도/주재료 — 예시 데이터.
 * 목록 응답엔 이 필드가 없어서, 백엔드에 컬럼이 생길 때까지 recipeNo 로 안정적으로 하나 골라 쓴다.
 * (recipeNo 로 고르니 리렌더해도 값이 안 바뀜)
 */
const EXAMPLE_CARD_INFO = [
  { cookTime: "15분", difficulty: "쉬움", mainIngredient: "두부, 계란" },
  { cookTime: "30분", difficulty: "보통", mainIngredient: "돼지고기, 김치" },
  { cookTime: "45분", difficulty: "어려움", mainIngredient: "소고기, 무" },
  { cookTime: "10분", difficulty: "쉬움", mainIngredient: "양배추, 당근" },
  { cookTime: "25분", difficulty: "보통", mainIngredient: "닭고기, 감자" },
];
const exampleCardInfo = (recipeNo) =>
  EXAMPLE_CARD_INFO[Math.abs(Number(recipeNo) || 0) % EXAMPLE_CARD_INFO.length];

/** 레시피 상세 경로 — App.jsx 의 <Route path="/recipe/:recipeNo"> 와 맞춰야 함 */
const recipeDetailPath = (recipeNo) => `/recipe/${recipeNo}`;

/**
 * 오늘의 추천 레시피 — 예시 데이터(캐러셀, < > 로 넘김).
 * 백엔드에 추천 API + 주재료/소요시간/난이도 필드가 생기면 이 배열을 응답으로 교체한다.
 * 이미지는 임시로 loremflickr(lock 고정) 를 쓴다 — 실제 추천 레시피가 생기면 recipesImgPath 로 교체.
 */
const FEATURED_RECIPES = [
  {
    recipeNo: null, // 실제 추천 레시피 번호가 생기면 채운다 → 그때 카드가 링크로 동작
    recipeTitle: "두부 계란찜",
    recipesImgPath:
      "https://mblogthumb-phinf.pstatic.net/MjAyMzA2MDFfMTI5/MDAxNjg1NTgxOTMzNzgw.rQq17F2lFcBrUQ9nbzAI0Xh60SNQTHv3aEdbdTicpj8g.UQZnpk5KzlwAa3Q6lNbOvzRpYhRHBmAqnwNbbRoB3jkg.JPEG.jasmin7141/SE-ac51bee9-81ca-44bc-be73-755d95b07a81.jpg?type=w800",
    memberName: "관리자",
    createDate: "2026-09-03",
    mainIngredient: "두부, 계란, 대파",
    cookTime: "15분",
    difficulty: "쉬움",
    summary:
      "부드럽고 촉촉한 계란찜에 두부를 더해 든든하게. 알레르기 걱정 없이 즐기는 기본 반찬.",
  },
  {
    recipeNo: null,
    recipeTitle: "애호박 된장찌개",
    recipesImgPath:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJTvYgJlXycDn_WPTtajTPx1IU7A-sAvBX2Mm1fxvwdw&s=10",
    memberName: "관리자",
    createDate: "2026-09-02",
    mainIngredient: "된장, 두부, 애호박",
    cookTime: "20분",
    difficulty: "보통",
    summary:
      "구수한 된장에 애호박과 두부를 넣고 팔팔 끓인 한 그릇. 밥 한 공기 뚝딱.",
  },
  {
    recipeNo: null,
    recipeTitle: "소고기 미역국",
    recipesImgPath:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9v-N3rKiS6Byto3xXNFTpnXCAD5R3E78uI_PADhsQzg&s=10",
    memberName: "관리자",
    createDate: "2026-09-01",
    mainIngredient: "소고기, 미역, 국간장",
    cookTime: "30분",
    difficulty: "보통",
    summary:
      "푹 우려낸 소고기 육수에 미역을 넉넉히. 생일상에도, 평범한 아침에도 좋은 국.",
  },
];

/**
 * 버튼 앞에 붙는 작은 아이콘들 — 라이브러리 없이 인라인 SVG.
 * stroke="currentColor" 라 버튼 텍스트 색을 그대로 따라간다.
 * 공용 Button(ButtonBase)이 inline-flex + gap 이라 아이콘/텍스트 간격은 자동.
 */
const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

/** 필터(슬라이더) 아이콘 */
function FilterIcon() {
  return (
    <svg {...iconProps}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

/** 펜(작성) 아이콘 — "조리법 등록하기" */
function WriteIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

/** 돋보기 아이콘 — 검색창 오른쪽 끝 */
function SearchIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

/** 좌/우 화살표 — 추천 캐러셀 넘기기 (dir: "prev" | "next") */
function ChevronIcon({ dir }) {
  return (
    <svg {...iconProps} width="20" height="20">
      {dir === "prev" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}

function RecipeListPage() {
  const { isReady } = useAuth(); // auth 부트스트랩(토큰 재발급) 완료 여부

  // 뒤로가기/앞으로가기(POP)로 진입했고 저장된 상태가 있으면 그걸로 복원, 아니면 기본값.
  const navigationType = useNavigationType();
  const [restored] = useState(() =>
    navigationType === "POP" ? readListState() : null,
  );

  const [page, setPage] = useState(restored?.page ?? 1); // 화면/Pagination 은 1부터, 서버는 0부터 → 요청 시 -1
  const [keyword, setKeyword] = useState(restored?.keyword ?? ""); // 검색창 값 (controlled input)
  const [excludeMaterials, setExcludeMaterials] = useState(
    /** @type {string[]} */ (restored?.excludeMaterials ?? []),
  ); // 필터 모달에서 "적용" 한 제외 재료명
  const [sortBy] = useState("latest"); // "latest" | "popular" — 인기순은 백엔드 미지원이라 아직 setter 없음
  const [category, setCategory] = useState(restored?.category ?? ALL_CATEGORY); // 선택된 카테고리 ("전체" = 미적용)
  const [presets, setPresets] = useState(
    /** @type {string[]} */ (restored?.presets ?? []),
  ); // 켜진 빠른 프리셋 key 들
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0); // 추천 캐러셀 현재 위치
  const [recipes, setRecipes] = useState(/** @type {RecipeListItem[]} */ ([]));
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 요청 순번 — 페이지를 빠르게 연타할 때 늦게 도착한 이전 응답이 최신 화면을 덮어쓰지 않게 함
  const requestIdRef = useRef(0);

  /**
   * 레시피 목록 조회. page(1부터)·keyword·excludeMaterials 를 인자로 직접 받아 호출한다.
   * (조회 시점 값을 그대로 넘겨 "state 변경 → 리렌더 → useEffect" 사이클을 안 탄다.)
   */
  const loadRecipes = async (
    targetPage,
    targetKeyword,
    targetExcludes,
    targetCategory,
    targetPresets,
  ) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError("");
    try {
      const params = { page: targetPage - 1, size: PAGE_SIZE };
      const trimmed = targetKeyword.trim();
      if (trimmed) params.keyword = trimmed;
      if (targetExcludes.length)
        params.excludeMaterials = targetExcludes.join(","); // 콤마 1개로 이어 보냄
      if (targetCategory && targetCategory !== ALL_CATEGORY)
        params.category = targetCategory; // 백엔드에 category 파라미터 생기면 그대로 동작 (현재는 무시됨)
      if (targetPresets?.length) params.presets = targetPresets.join(","); // 빠른 프리셋 — 백엔드 지원 시 동작
      // TODO(백엔드): sort 파라미터 생기면 params.sort = sortBy 연결 (지금은 최신순 고정)

      const res = await getFilteredRecipes(params);
      if (requestId !== requestIdRef.current) return; // 더 최근 요청이 있으면 버림
      /** @type {RecipeListResponse} */
      const data = res?.data ?? { recipes: [], pageInfo: { totalPages: 1 } };
      setRecipes(data.recipes ?? []);
      setTotalPages(data.pageInfo?.totalPages ?? 1);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.msg ?? "레시피 목록을 불러오지 못했습니다.");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  // 최초 진입 시 1페이지 조회. auth 부트스트랩(refresh 로 access token 재발급) 완료 후에
  // 호출해야 요청에 토큰이 붙어 백엔드가 "그 회원의 알러지 재료를 뺀" 목록을 준다.
  // (/filter 는 인증 선택이라 토큰 없이 보내면 401 이 아니라 게스트 목록 200 이 와서 재시도도 안 걸림)
  useEffect(() => {
    if (!isReady) return;
    // 복원된 값(뒤로가기) 또는 기본값으로 최초 조회
    loadRecipes(page, keyword, excludeMaterials, category, presets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // 현재 화면 상태를 sessionStorage 에 저장 — 상세 갔다가 뒤로가기로 돌아오면 이걸로 복원
  useEffect(() => {
    writeListState({ page, keyword, excludeMaterials, category, presets });
  }, [page, keyword, excludeMaterials, category, presets]);

  // 인풋에서 엔터(form submit) → 1페이지부터 현재 입력값 + 적용된 필터/카테고리/프리셋으로 조회
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadRecipes(1, keyword, excludeMaterials, category, presets);
  };

  // 페이지 이동 → 현재 검색창 값 + 적용된 필터/카테고리/프리셋 유지한 채 해당 페이지 조회
  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    loadRecipes(nextPage, keyword, excludeMaterials, category, presets);
  };

  // 필터 모달 "적용하기" → 선택된 제외 재료로 교체하고 1페이지부터 다시 조회
  const handleApplyFilter = (nextExcludes) => {
    setExcludeMaterials(nextExcludes);
    setIsFilterOpen(false);
    setPage(1);
    loadRecipes(1, keyword, nextExcludes, category, presets);
  };

  // 카테고리 선택 → 1페이지부터 그 카테고리로 조회
  const handleSelectCategory = (nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
    loadRecipes(1, keyword, excludeMaterials, nextCategory, presets);
  };

  // 빠른 프리셋 토글 (여러 개 동시 가능) → 1페이지부터 다시 조회
  const handleTogglePreset = (key) => {
    const nextPresets = presets.includes(key)
      ? presets.filter((p) => p !== key)
      : [...presets, key];
    setPresets(nextPresets);
    setPage(1);
    loadRecipes(1, keyword, excludeMaterials, category, nextPresets);
  };

  // 추천 캐러셀 넘기기 (양끝에서 순환)
  const moveFeatured = (step) =>
    setFeaturedIndex(
      (i) => (i + step + FEATURED_RECIPES.length) % FEATURED_RECIPES.length,
    );
  const featured = FEATURED_RECIPES[featuredIndex];

  // 5초마다 자동으로 다음 추천으로. featuredIndex 가 바뀔 때마다 타이머를 다시 걸어서
  // 사용자가 화살표/닷으로 수동으로 넘겨도 카운트다운이 리셋된다.
  useEffect(() => {
    if (FEATURED_RECIPES.length <= 1) return;
    const timerId = setTimeout(() => moveFeatured(1), 5000);
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredIndex]);

  return (
    <PageWrapper className="container">
      {/* ---------- 오늘의 추천 레시피 (예시 데이터 캐러셀) ---------- */}
      <RecommendSection>
        <FeaturedCarousel>
          <CarouselArrow
            type="button"
            aria-label="이전 추천"
            $side="left"
            onClick={() => moveFeatured(-1)}
          >
            <ChevronIcon dir="prev" />
          </CarouselArrow>

          <FeaturedCard>
            <FeaturedThumb>
              {featured.recipesImgPath ? (
                <img
                  src={featured.recipesImgPath}
                  alt={featured.recipeTitle}
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              ) : (
                <FeaturedThumbFallback aria-hidden="true">
                  🍳
                </FeaturedThumbFallback>
              )}
            </FeaturedThumb>
            <FeaturedBody>
              <FeaturedEyebrow>오늘의 추천 레시피</FeaturedEyebrow>
              <FeaturedTitle>{featured.recipeTitle}</FeaturedTitle>

              <FeaturedSpecRow>
                <FeaturedSpec>⏱ {featured.cookTime}</FeaturedSpec>
                <CardDifficulty $level={featured.difficulty}>
                  난이도 {featured.difficulty}
                </CardDifficulty>
              </FeaturedSpecRow>

              <FeaturedSummary>{featured.summary}</FeaturedSummary>
              <FeaturedIngredient>
                주재료 · {featured.mainIngredient}
              </FeaturedIngredient>

              <FeaturedMeta>
                <span>{featured.memberName}</span>
                <span>{featured.createDate}</span>
              </FeaturedMeta>
            </FeaturedBody>
          </FeaturedCard>

          <CarouselArrow
            type="button"
            aria-label="다음 추천"
            $side="right"
            onClick={() => moveFeatured(1)}
          >
            <ChevronIcon dir="next" />
          </CarouselArrow>
        </FeaturedCarousel>

        <CarouselDots>
          {FEATURED_RECIPES.map((r, i) => (
            <CarouselDot
              key={r.recipeTitle}
              type="button"
              $active={i === featuredIndex}
              aria-label={`추천 ${i + 1}번으로`}
              aria-current={i === featuredIndex}
              onClick={() => setFeaturedIndex(i)}
            />
          ))}
        </CarouselDots>
      </RecommendSection>

      {/* ---------- 툴바 ---------- */}
      <Toolbar>
        {/* 1행: 필터 · 정렬 · 카테고리 ... 등록 (한 줄, 카테고리만 넘치면 가로 스크롤) */}
        <ToolbarRow>
          <ToolbarGroup>
            <Button variant="secondary" onClick={() => setIsFilterOpen(true)}>
              <FilterIcon />
              필터
              {excludeMaterials.length > 0 && ` (${excludeMaterials.length})`}
            </Button>

            <SortToggle role="group" aria-label="정렬 기준">
              <SortOption
                type="button"
                $active={sortBy === "latest"}
                aria-pressed={sortBy === "latest"}
              >
                최신순
              </SortOption>
              <SortOption
                type="button"
                disabled
                title="인기순 정렬은 준비 중입니다"
              >
                인기순
              </SortOption>
            </SortToggle>
          </ToolbarGroup>

          <ToolbarEnd>
            <SearchForm onSubmit={handleSearchSubmit}>
              <SearchInput
                type="search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="레시피 검색"
                aria-label="레시피 검색"
              />
              <SearchSubmit type="submit" aria-label="검색">
                <SearchIcon />
              </SearchSubmit>
            </SearchForm>
            <RegisterButton to={RECIPE_FORM_PATH}>
              <WriteIcon />
              조리법 등록
            </RegisterButton>
          </ToolbarEnd>
        </ToolbarRow>

        {/* 카테고리(왼쪽) + 빠른 프리셋(오른쪽, 카테고리 뒤 빈 공간을 채움) 한 줄 */}
        <CategoryRow>
          {/* 카테고리 — 텍스트 전에 비주얼로 종류가 보이게 (지금은 이모지, 나중에 대표 이미지) */}
          <CategoryBar role="group" aria-label="카테고리">
            {RECIPE_CATEGORIES.map(({ key, emoji }) => (
              <CategoryCard
                key={key}
                type="button"
                $active={key === category}
                aria-pressed={key === category}
                onClick={() => handleSelectCategory(key)}
              >
                <CategoryThumb aria-hidden="true">{emoji}</CategoryThumb>
                <CategoryLabel>{key}</CategoryLabel>
              </CategoryCard>
            ))}
          </CategoryBar>

          {/* 후식 ↔ 프리셋 구분선 */}
          <RowDivider aria-hidden="true" />

          {/* 빠른 프리셋 — 카테고리와 같은 이모지 타일. 원클릭 필터(여러 개 동시), 백엔드 지원 전이라 배선만 */}
          <PresetGroup role="group" aria-label="빠른 필터">
            {RECIPE_PRESETS.map(({ key, emoji, label }) => (
              <PresetTile
                key={key}
                type="button"
                aria-label={label}
                $active={presets.includes(key)}
                aria-pressed={presets.includes(key)}
                onClick={() => handleTogglePreset(key)}
              >
                <PresetThumb aria-hidden="true">{emoji}</PresetThumb>
                <PresetLabel>{label}</PresetLabel>
              </PresetTile>
            ))}
          </PresetGroup>
        </CategoryRow>
      </Toolbar>

      {/* ---------- 목록 ---------- */}
      <ContentArea>
        {isLoading ? (
          <Loading label="레시피 목록을 불러오는 중" />
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : recipes.length === 0 ? (
          <EmptyState>
            <EmptyText>등록된 레시피가 없습니다.</EmptyText>
            <Button as={Link} to={RECIPE_FORM_PATH} variant="primary" size="sm">
              첫 조리법 등록하기
            </Button>
          </EmptyState>
        ) : (
          <>
            <RecipeGrid>
              {recipes.map((recipe) => {
                const info = exampleCardInfo(recipe.recipeNo); // 예시 데이터 (조리시간·난이도·주재료)
                return (
                  <li key={recipe.recipeNo}>
                    <RecipeCard to={recipeDetailPath(recipe.recipeNo)}>
                      <CardThumb>
                        <img
                          src={recipe.recipesImgPath}
                          alt={recipe.recipeTitle}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                        />
                      </CardThumb>
                      <CardBody>
                        <CardTitle>{recipe.recipeTitle}</CardTitle>

                        <CardSpecRow>
                          <CardSpec>⏱ {info.cookTime}</CardSpec>
                          <CardDifficulty $level={info.difficulty}>
                            {info.difficulty}
                          </CardDifficulty>
                        </CardSpecRow>

                        <CardMainIngredient>
                          주재료 · {info.mainIngredient}
                        </CardMainIngredient>

                        <CardMeta>
                          <span>{recipe.createDate}</span>
                          <span>{recipe.memberName}</span>
                        </CardMeta>
                      </CardBody>
                    </RecipeCard>
                  </li>
                );
              })}
            </RecipeGrid>

            <PaginationWrap>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </PaginationWrap>
          </>
        )}
      </ContentArea>

      <FilterModal
        isOpen={isFilterOpen}
        selected={excludeMaterials}
        onApply={handleApplyFilter}
        onClose={() => setIsFilterOpen(false)}
      />
    </PageWrapper>
  );
}

export default RecipeListPage;
