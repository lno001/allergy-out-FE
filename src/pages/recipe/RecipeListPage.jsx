import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import { getFilteredRecipes } from "../../apis/recipeApi";
import FilterModal from "./FilterModal";
import {
  PageWrapper,
  TopRow,
  FilterRow,
  SearchForm,
  SearchInput,
  ActiveFilterRow,
  FilterChip,
  ChipRemove,
  ContentArea,
  RecipeGrid,
  RecipeCard,
  CardThumb,
  CardBody,
  CardTitle,
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
 * - 인증: 회원이면 토큰이 자동 첨부되어 백엔드가 본인 알러지 재료를 뺀 목록을 준다.
 *   비회원이면 전체 목록. 프론트는 동일하게 호출만 하고 분기하지 않는다.
 * - 검색: 검색창 + "검색" 버튼(또는 엔터). keyword 가 비면 파라미터를 빼서 전체 조회.
 * - 필터: "필터" 버튼 → FilterModal 에서 제외할 재료명을 고르고 "적용하기".
 *   선택된 재료는 목록 상단에 chip 으로 표시하고 개별 제거 가능.
 * - 실시간이 아니라 submit·페이지 이동·필터 적용 시점에 loadRecipes(page, keyword,
 *   excludeMaterials) 를 그때 값으로 직접 호출한다. (검색어는 별도 state 로 안 들고,
 *   제외 재료 목록만 적용된 상태라 state 로 유지한다.)
 * - 헤더/푸터는 components/layout 담당. 라우트 등록(App.jsx)은 이번 범위 아님.
 * - props 없음 → @typedef(props) 두지 않음 (CLAUDE.md 2.[작명]).
 */

/**
 * @typedef {Object} RecipeListItem
 * @property {number} recipeNo
 * @property {string} recipeTitle
 * @property {string} recipeMainImg    대표 이미지 "원본 파일명" (표시용, src 에 쓰지 않음)
 * @property {string} recipesImgPath   대표 이미지 S3 URL ← <img src> (= RECIPES_IMG_PATH)
 * @property {string} memberName      작성자 이름
 * @property {string} createDate      "YYYY-MM-DD"
 */

/**
 * @typedef {Object} PageInfo
 * @property {number} page           현재 페이지 (0부터)
 * @property {number} size
 * @property {number} offset
 * @property {number} totalElements
 * @property {number} totalPages
 */

/**
 * @typedef {Object} RecipeListResponse
 * GET /api/recipes/filter 성공 응답의 data
 * @property {RecipeListItem[]} recipes
 * @property {PageInfo}         pageInfo
 */

const PAGE_SIZE = 10; // 한 페이지에 보여줄 레시피 수 (명세 예시 size=10)
const RECIPE_FORM_PATH = "/recipe/form"; // 조리법 등록 화면

/** 레시피 상세 경로 — App.jsx 의 <Route path="/recipe/:recipeNo"> 와 맞춰야 함 */
const recipeDetailPath = (recipeNo) => `/recipe/${recipeNo}`;

function RecipeListPage() {
  const [page, setPage] = useState(1); // 화면/Pagination 은 1부터, 서버는 0부터 → 요청 시 -1
  const [keyword, setKeyword] = useState(""); // 검색창에 입력 중인 값 (controlled input)
  const [excludeMaterials, setExcludeMaterials] = useState(
    /** @type {string[]} */ ([]),
  ); // 필터 모달에서 "적용" 한 제외 재료명 (적용된 상태라 state 유지)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [recipes, setRecipes] = useState(/** @type {RecipeListItem[]} */ ([]));
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // 요청 순번 — 페이지를 빠르게 연타할 때 늦게 도착한 이전 응답이 최신 화면을 덮어쓰지 않게 함
  const requestIdRef = useRef(0);

  /**
   * 레시피 목록 조회. page(1부터)·keyword·excludeMaterials 를 인자로 직접 받아 호출한다.
   * 검색어를 state 로 안 들고 인자로 넘기는 이유: 조회 시점 값을 그대로 쓰면
   * "state 변경 → 리렌더 → useEffect" 사이클 없이 바로 요청할 수 있어서.
   */
  const loadRecipes = async (targetPage, targetKeyword, targetExcludes) => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setError("");
    try {
      const params = { page: targetPage - 1, size: PAGE_SIZE };
      const trimmed = targetKeyword.trim();
      if (trimmed) params.keyword = trimmed; // 비면 생략 → 제목 필터 없음
      if (targetExcludes.length) params.excludeMaterials = targetExcludes.join(","); // 콤마 1개로 이어 보냄

      const res = await getFilteredRecipes(params);
      if (requestId !== requestIdRef.current) return; // 더 최근 요청이 있으면 이 응답은 버림
      /** @type {RecipeListResponse} */
      const data = res?.data ?? { recipes: [], pageInfo: { totalPages: 1 } };
      setRecipes(data.recipes ?? []);
      setTotalPages(data.pageInfo?.totalPages ?? 1);
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      // 인터셉터가 { code, msg, data, status } 로 reject → 서버 msg 그대로 노출
      setError(err?.msg ?? "레시피 목록을 불러오지 못했습니다.");
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  };

  // 최초 진입 시 1페이지 전체 목록 (이후 조회는 아래 핸들러들이 직접 호출)
  useEffect(() => {
    loadRecipes(1, "", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 검색 버튼 클릭 또는 인풋에서 엔터(form submit) → 1페이지부터 현재 입력값 + 적용된 필터로 조회
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadRecipes(1, keyword, excludeMaterials);
  };

  // 페이지 이동 → 현재 검색창 값 + 적용된 필터 유지한 채 해당 페이지 조회.
  // (검색을 누르지 않고 입력만 바꾼 상태라면 그 입력값으로 조회된다 — 대부분의 게시판과 동일)
  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    loadRecipes(nextPage, keyword, excludeMaterials);
  };

  // 필터 모달 "적용하기" → 선택된 제외 재료로 교체하고 1페이지부터 다시 조회
  const handleApplyFilter = (nextExcludes) => {
    setExcludeMaterials(nextExcludes);
    setIsFilterOpen(false);
    setPage(1);
    loadRecipes(1, keyword, nextExcludes);
  };

  // 상단 chip 의 × → 그 재료 하나만 필터에서 빼고 다시 조회
  const handleRemoveExclude = (material) => {
    const nextExcludes = excludeMaterials.filter((m) => m !== material);
    setExcludeMaterials(nextExcludes);
    setPage(1);
    loadRecipes(1, keyword, nextExcludes);
  };

  return (
    <PageWrapper className="container">
      <TopRow>
        <Button as={Link} to={RECIPE_FORM_PATH} variant="primary">
          조리법 등록하기
        </Button>
      </TopRow>

      <FilterRow>
        <Button
          variant="secondary"
          onClick={() => setIsFilterOpen(true)}
        >
          필터{excludeMaterials.length > 0 && ` (${excludeMaterials.length})`}
        </Button>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="안전한 재료, 레시피를 검색해보세요"
            aria-label="레시피 검색"
          />
          <Button type="submit" variant="primary">
            검색
          </Button>
        </SearchForm>
      </FilterRow>

      {excludeMaterials.length > 0 && (
        <ActiveFilterRow>
          {excludeMaterials.map((material) => (
            <FilterChip key={material}>
              {material} 제외
              <ChipRemove
                type="button"
                onClick={() => handleRemoveExclude(material)}
                aria-label={`${material} 필터 제거`}
              >
                ✕
              </ChipRemove>
            </FilterChip>
          ))}
        </ActiveFilterRow>
      )}

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
              {recipes.map((recipe) => (
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
                      <CardMeta>
                        <span>{recipe.createDate}</span>
                        <span>{recipe.memberName}</span>
                      </CardMeta>
                    </CardBody>
                  </RecipeCard>
                </li>
              ))}
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
