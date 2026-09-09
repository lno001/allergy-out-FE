import { useEffect, useRef, useState } from "react";
import { Link, useNavigationType } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import { useAuth } from "../../hooks/useAuth";
import { getRecipeList, getRecommendRecipes } from "../../apis/recipeApi";
import {
  ALL_FILTER,
  COOKING_METHOD_TILES,
  DEFAULT_SORT,
  EMPTY_TEXT,
  RECIPE_TYPE_TILES,
  SORT_OPTIONS,
  formatMeasure,
  isBlankValue,
} from "../../constants/recipe";
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
  AllergyToggle,
  AllergySwitch,
  AllergySwitchLabel,
  AllergyKnob,
  CategoryRow,
  RowDivider,
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
  CardViewCount,
  CardBody,
  CardTitle,
  CardSpecRow,
  CardTypeBadge,
  CardMethod,
  CardCalorie,
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
 * 조회는 GET /api/recipes 하나로 통일(구 /api/recipes/filter 흡수) — 검색어(keyword),
 * 제외 재료(excludeMaterials), 요리종류(recipeType), 조리방법(cookingMethod),
 * 정렬(sort), 회원 알러지 on/off(applyMyAllergy) + 페이지네이션을 한 번에 받는다.
 *
 * 화면 구성:
 *  1) 오늘의 추천 레시피 — 큰 카드 1개. 백엔드 추천 API 전이라 예시 데이터 하드코딩(범위 밖).
 *  2) 툴바
 *     - 1행: [필터] [최신순/인기순] [알러지 토글(회원)] ... [검색창] [조리법 등록]
 *     - 2행: 카테고리 2축 — 요리종류 타일 | 조리방법 타일 (둘 다 단일 선택)
 *  3) 카드 그리드 4열, 한 페이지 8개(PAGE_SIZE).
 *
 * - 인증: 회원이면 토큰이 자동 첨부되어 백엔드가 본인 알러지 재료를 뺀 목록을 준다.
 * - 검색: 검색창 엔터. keyword 가 비면 파라미터를 빼서 전체 조회.
 * - 필터: "필터" 버튼 → FilterModal 에서 제외할 재료명을 고르고 "적용하기".
 *   적용된 개수는 "필터 (N)" 로만 표시하고, 변경은 모달을 다시 열어서 한다.
 * - 조회는 submit·페이지 이동·요리종류/조리방법/정렬/알러지토글 변경 시점에 loadRecipes({...}) 직접 호출.
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
 * @property {string} recipeType      요리 종류 (밥/국&찌개/… — NOT NULL)
 * @property {string} cookingMethod   조리 방법 (굽기/튀기기/… — NOT NULL)
 * @property {(number|null)} calorie   칼로리(kcal). 단위는 프론트가 붙임
 * @property {(string|null)} mainMaterial  메인 재료 1개
 * @property {number} viewCount       조회수
 */

/**
 * @typedef {Object} RecipeListResponse
 * GET /api/recipes 성공 응답의 data (구 /filter 흡수)
 * @property {RecipeListItem[]} recipes
 * @property {{ page:number, size:number, offset:number, totalElements:number, totalPages:number }} pageInfo
 */

const PAGE_SIZE = 8; // 4열 × 2행
const RECIPE_FORM_PATH = "/recipe/form"; // 조리법 등록 화면

/**
 * 목록 화면 상태(페이지·검색어·제외재료·요리종류·조리방법·정렬·알러지토글)를
 * sessionStorage 에 저장/복원. 상세 → 뒤로가기(브라우저 back) 로 돌아왔을 때 보던
 * 페이지 그대로 복원하기 위함.
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

/* 카테고리(요리종류)·조리방법 필터 타일, 정렬 옵션은 constants/recipe.js 로 이동:
   RECIPE_TYPE_TILES / COOKING_METHOD_TILES / SORT_OPTIONS / ALL_FILTER / DEFAULT_SORT.
   카드의 조리시간·난이도는 백엔드에 컬럼이 없어 폐기(예시 데이터 제거). */

/** 레시피 상세 경로 — App.jsx 의 <Route path="/recipe/:recipeNo"> 와 맞춰야 함 */
const recipeDetailPath = (recipeNo) => `/recipe/${recipeNo}`;

/**
 * 오늘의 추천 레시피
 * 브라우저 로컬 년-월-일. 서버 시계가 아니라 사용자 PC/폰의 "오늘".
 */
const getLocalDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

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

/** 눈 아이콘 — 카드 조회수 뱃지 */
function EyeIcon() {
  return (
    <svg {...iconProps} width="12" height="12">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
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
  const { isReady, user } = useAuth(); // isReady: 부트스트랩 완료 / user: 로그인 회원 정보(없으면 비회원)

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
  const [recipeType, setRecipeType] = useState(
    restored?.recipeType ?? ALL_FILTER,
  ); // 요리종류 필터 ("전체" = 미적용). 단일 선택
  const [cookingMethod, setCookingMethod] = useState(
    restored?.cookingMethod ?? ALL_FILTER,
  ); // 조리방법 필터 ("전체" = 미적용). 단일 선택
  const [sortBy, setSortBy] = useState(restored?.sortBy ?? DEFAULT_SORT); // "latest" | "popular"
  const [excludeMyAllergy, setExcludeMyAllergy] = useState(
    restored?.excludeMyAllergy ?? true,
  ); // 회원 본인 알러지 재료가 든 레시피 숨김 여부 (기본 켜짐 = 백엔드 기본 동작)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0); // 추천 캐러셀 현재 위치
  const [recipes, setRecipes] = useState(/** @type {RecipeListItem[]} */ ([]));
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 요청 순번 — 페이지를 빠르게 연타할 때 늦게 도착한 이전 응답이 최신 화면을 덮어쓰지 않게 함
  const requestIdRef = useRef(0);

  /**
   * 레시피 목록 조회 — 조회 시점의 값들을 인자로 직접 받아 호출한다
   * (state 변경 → 리렌더 → useEffect 사이클을 안 타려고).
   * "전체"·기본 정렬은 파라미터에서 빼고, 늦게 온 응답은 requestId 로 버린다.
   */
  const loadRecipes = async ({
    page: targetPage = 1,
    keyword: targetKeyword = "",
    excludeMaterials: targetExcludes = [],
    recipeType: targetRecipeType = ALL_FILTER,
    cookingMethod: targetCookingMethod = ALL_FILTER,
    sortBy: targetSort = DEFAULT_SORT,
    excludeMyAllergy: targetExcludeMyAllergy = true,
  } = {}) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError("");
    try {
      const params = { page: targetPage - 1, size: PAGE_SIZE };
      const trimmed = targetKeyword.trim();
      if (trimmed) params.keyword = trimmed;
      if (targetExcludes.length)
        params.excludeMaterials = targetExcludes.join(","); // 콤마 1개로 이어 보냄
      if (targetRecipeType && targetRecipeType !== ALL_FILTER)
        params.recipeType = targetRecipeType; // 한글/`&` 는 axios 가 인코딩
      if (targetCookingMethod && targetCookingMethod !== ALL_FILTER)
        params.cookingMethod = targetCookingMethod;
      if (targetSort && targetSort !== DEFAULT_SORT) params.sort = targetSort;
      if (targetExcludeMyAllergy === false) params.applyMyAllergy = "false"; // 기본(켜짐)은 파라미터 생략

      const res = await getRecipeList(params);
      if (requestId !== requestIdRef.current) return; // 더 최근 요청이 있으면 버림
      /** @type {RecipeListResponse} */
      const data = res?.data ?? { recipes: [], pageInfo: { totalPages: 1 } };
      setRecipes(data.recipes ?? []);
      setTotalPages(data.pageInfo?.totalPages ?? 1);
      const recommendParams = { date: getLocalDate() };
      if (trimmed) recommendParams.keyword = trimmed;
      if (targetExcludes.length)
        recommendParams.excludeMaterials = targetExcludes.join(",");
      if (targetRecipeType && targetRecipeType !== ALL_FILTER)
        recommendParams.recipeType = targetRecipeType;
      if (targetCookingMethod && targetCookingMethod !== ALL_FILTER)
        recommendParams.cookingMethod = targetCookingMethod;
      if (targetExcludeMyAllergy === false)
        recommendParams.applyMyAllergy = "false";

      try {
        const recRes = await getRecommendRecipes(recommendParams);
        if (requestId !== requestIdRef.current) return;
        setFeaturedRecipes(recRes?.data?.recipes ?? []);
        setFeaturedIndex(0);
      } catch {
        if (requestId !== requestIdRef.current) return;
        setFeaturedRecipes([]);
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setError(err?.msg ?? "레시피 목록을 불러오지 못했습니다.");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  // 지금 조회에 쓰는 검색/필터/정렬 상태 한 묶음 (loadRecipes 에 그대로 펼쳐 넘긴다)
  const queryState = {
    keyword,
    excludeMaterials,
    recipeType,
    cookingMethod,
    sortBy,
    excludeMyAllergy,
  };

  // 최초 진입 시 조회. auth 부트스트랩(refresh 로 access token 재발급) 완료 후에 호출해야
  // 요청에 토큰이 붙어 백엔드가 "그 회원의 알러지 재료를 뺀" 목록을 준다.
  // (인증 선택 엔드포인트라 토큰 없이 보내면 401 이 아니라 게스트 목록 200 → 재시도도 안 걸림)
  useEffect(() => {
    if (!isReady) return;
    // 복원된 값(뒤로가기) 또는 기본값으로 최초 조회
    loadRecipes({ page, ...queryState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  // 현재 화면 상태를 sessionStorage 에 저장 — 상세 갔다가 뒤로가기로 돌아오면 이걸로 복원
  useEffect(() => {
    writeListState({ page, ...queryState });
  }, [
    page,
    keyword,
    excludeMaterials,
    recipeType,
    cookingMethod,
    sortBy,
    excludeMyAllergy,
  ]);

  // 인풋에서 엔터(form submit) → 1페이지부터 현재 입력값 + 적용된 필터로 조회
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadRecipes({ page: 1, ...queryState });
  };

  // 페이지 이동 → 현재 검색/필터 유지한 채 해당 페이지 조회
  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    loadRecipes({ page: nextPage, ...queryState });
  };

  // 필터 모달 "적용하기" → 선택된 제외 재료로 교체하고 1페이지부터 다시 조회
  const handleApplyFilter = (nextExcludes) => {
    setExcludeMaterials(nextExcludes);
    setIsFilterOpen(false);
    setPage(1);
    loadRecipes({ page: 1, ...queryState, excludeMaterials: nextExcludes });
  };

  // 요리종류 선택 → 1페이지부터 다시 조회. 켜진 칩을 다시 누르면 "전체"(해제)
  const handleSelectRecipeType = (nextType) => {
    const applied = nextType === recipeType ? ALL_FILTER : nextType;
    if (applied === recipeType) return; // 이미 그 상태 (예: "전체"에서 "전체" 클릭)
    setRecipeType(applied);
    setPage(1);
    loadRecipes({ page: 1, ...queryState, recipeType: applied });
  };

  // 조리방법 선택 → 1페이지부터 다시 조회. 켜진 칩을 다시 누르면 "전체"(해제)
  const handleSelectCookingMethod = (nextMethod) => {
    const applied = nextMethod === cookingMethod ? ALL_FILTER : nextMethod;
    if (applied === cookingMethod) return;
    setCookingMethod(applied);
    setPage(1);
    loadRecipes({ page: 1, ...queryState, cookingMethod: applied });
  };

  // 정렬 변경 (최신순 ↔ 인기순) → 1페이지부터 다시 조회
  const handleSelectSort = (nextSort) => {
    if (nextSort === sortBy) return;
    setSortBy(nextSort);
    setPage(1);
    loadRecipes({ page: 1, ...queryState, sortBy: nextSort });
  };

  // 내 알러지 재료 숨김 on/off → 1페이지부터 다시 조회 (회원만 노출되는 버튼)
  const handleToggleMyAllergy = () => {
    const next = !excludeMyAllergy;
    setExcludeMyAllergy(next);
    setPage(1);
    loadRecipes({ page: 1, ...queryState, excludeMyAllergy: next });
  };

  // 추천 캐러셀 넘기기 (양끝에서 순환)
  const featuredCount = featuredRecipes.length;
  const featured = featuredRecipes[featuredIndex];

  const moveFeatured = (step) => {
    if (featuredCount === 0) return;
    setFeaturedIndex((i) => (i + step + featuredCount) % featuredCount);
  };

  // 5초마다 자동으로 다음 추천으로. featuredIndex 가 바뀔 때마다 타이머를 다시 걸어서
  // 사용자가 화살표/닷으로 수동으로 넘겨도 카운트다운이 리셋된다.
  useEffect(() => {
    if (featuredCount <= 1) return;
    const timerId = setTimeout(() => moveFeatured(1), 5000);
    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredIndex, featuredCount]);

  return (
    <PageWrapper className="container">
      {/* ---------- 오늘의 추천 레시피 (예시 데이터 캐러셀) ---------- */}
      {featured && (
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

            <FeaturedCard as={Link} to={recipeDetailPath(featured.recipeNo)}>
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

                {(featured.recipeType || featured.cookingMethod) && (
                  <FeaturedSpecRow>
                    {featured.recipeType && (
                      <CardTypeBadge>{featured.recipeType}</CardTypeBadge>
                    )}
                    {featured.cookingMethod && (
                      <FeaturedSpec>{featured.cookingMethod}</FeaturedSpec>
                    )}
                  </FeaturedSpecRow>
                )}

                <FeaturedIngredient>
                  {isBlankValue(featured.calorie)
                    ? EMPTY_TEXT
                    : formatMeasure(featured.calorie, "kcal")}
                </FeaturedIngredient>
                <FeaturedIngredient>
                  주재료 ·{" "}
                  {isBlankValue(featured.mainMaterial)
                    ? EMPTY_TEXT
                    : featured.mainMaterial}
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
            {featuredRecipes.map((r, i) => (
              <CarouselDot
                key={r.recipeNo}
                type="button"
                $active={i === featuredIndex}
                aria-label={`추천 ${i + 1}번으로`}
                aria-current={i === featuredIndex}
                onClick={() => setFeaturedIndex(i)}
              />
            ))}
          </CarouselDots>
        </RecommendSection>
      )}

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
              {SORT_OPTIONS.map(({ key, label }) => (
                <SortOption
                  key={key}
                  type="button"
                  $active={sortBy === key}
                  aria-pressed={sortBy === key}
                  onClick={() => handleSelectSort(key)}
                >
                  {label}
                </SortOption>
              ))}
            </SortToggle>

            {/* 회원 본인 알러지 자동 제외 on/off — 로그인 회원에게만 노출.
                좌우로 미끄러지는 스위치, 상태 문구가 스위치 안에서 같이 움직인다 */}
            {user && (
              <AllergyToggle
                type="button"
                role="switch"
                aria-label="내 알러지 재료 숨기기"
                aria-checked={excludeMyAllergy}
                onClick={handleToggleMyAllergy}
                title={
                  excludeMyAllergy
                    ? "내 알러지 재료가 든 레시피를 숨기는 중 — 눌러서 전체 보기"
                    : "모든 레시피를 보는 중 — 눌러서 내 알러지 숨기기"
                }
              >
                <AllergySwitch $on={excludeMyAllergy}>
                  <AllergySwitchLabel $on={excludeMyAllergy}>
                    {excludeMyAllergy ? "알러지 숨김" : "전체 보기"}
                  </AllergySwitchLabel>
                  <AllergyKnob $on={excludeMyAllergy} />
                </AllergySwitch>
              </AllergyToggle>
            )}
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

        {/* 카테고리 축 2개 — 왼쪽 요리종류 / 오른쪽 조리방법. 둘 다 단일 선택.
            텍스트 전에 이모지로 종류가 눈에 들어오게 (나중에 대표 썸네일로 교체) */}
        <CategoryRow>
          <CategoryBar role="group" aria-label="요리 종류">
            {RECIPE_TYPE_TILES.map(({ key, emoji }) => (
              <CategoryCard
                key={key}
                type="button"
                $active={key === recipeType}
                aria-pressed={key === recipeType}
                onClick={() => handleSelectRecipeType(key)}
              >
                <CategoryThumb aria-hidden="true">{emoji}</CategoryThumb>
                <CategoryLabel>{key}</CategoryLabel>
              </CategoryCard>
            ))}
          </CategoryBar>

          {/* 요리종류 ↔ 조리방법 구분선 */}
          <RowDivider aria-hidden="true" />

          <CategoryBar role="group" aria-label="조리 방법">
            {COOKING_METHOD_TILES.map(({ key, emoji }) => (
              <CategoryCard
                key={key}
                type="button"
                $active={key === cookingMethod}
                aria-pressed={key === cookingMethod}
                onClick={() => handleSelectCookingMethod(key)}
              >
                <CategoryThumb aria-hidden="true">{emoji}</CategoryThumb>
                <CategoryLabel>{key}</CategoryLabel>
              </CategoryCard>
            ))}
          </CategoryBar>
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
                        <CardViewCount>
                          <EyeIcon />
                          {Number(recipe.viewCount ?? 0).toLocaleString()}
                        </CardViewCount>
                      </CardThumb>
                      <CardBody>
                        <CardTitle>{recipe.recipeTitle}</CardTitle>

                        {/* 요리종류(뱃지) + 조리방법(텍스트) — 둘 다 NOT NULL,
                            필드 미배포 응답 대비 방어적 렌더 */}
                        {(recipe.recipeType || recipe.cookingMethod) && (
                          <CardSpecRow>
                            {recipe.recipeType && (
                              <CardTypeBadge>{recipe.recipeType}</CardTypeBadge>
                            )}
                            {recipe.cookingMethod && (
                              <CardMethod>{recipe.cookingMethod}</CardMethod>
                            )}
                          </CardSpecRow>
                        )}

                        <CardCalorie>
                          {isBlankValue(recipe.calorie)
                            ? EMPTY_TEXT
                            : formatMeasure(recipe.calorie, "kcal")}
                        </CardCalorie>

                        <CardMainIngredient>
                          주재료 ·{" "}
                          {isBlankValue(recipe.mainMaterial)
                            ? EMPTY_TEXT
                            : recipe.mainMaterial}
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
