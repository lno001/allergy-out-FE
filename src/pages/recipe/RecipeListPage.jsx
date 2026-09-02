import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import { getRecipeList } from "../../apis/recipeApi";
import {
  PageWrapper,
  TopRow,
  FilterRow,
  SearchForm,
  SearchInput,
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
 * 명세: 조리법 목록 조회 V1.4 + 조리법 목록 키워드 조회 V1.3
 *      — GET /api/recipes?page=&size=&keyword=
 *
 * - 인증: 회원이면 토큰이 자동 첨부되어 백엔드가 알러지 재료를 뺀 목록을 준다.
 *   비회원이면 전체 목록. 프론트는 동일하게 호출만 하고 분기하지 않는다.
 * - 검색: 검색창에 키워드를 넣고 "검색" 버튼(또는 엔터) → keyword 파라미터로 전달.
 *   keyword 가 비어 있으면 파라미터를 빼서 전체 조회와 동일하게 동작한다(스펙).
 *   실시간 검색이 아니라 submit 시점에만 요청 → 입력용 keyword 와
 *   "확정된 검색어" appliedKeyword 를 분리해 둔다.
 * - "필터 변경" 은 아직 명세에 필터 파라미터가 없어 비활성 UI 로 남겨둔다.
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
 * GET /api/recipes 성공 응답의 data (명세 조리법 목록 조회 V1.4)
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
  const [appliedKeyword, setAppliedKeyword] = useState(""); // 검색 버튼/엔터로 확정된 검색어 → 실제 요청에 사용
  const [recipes, setRecipes] = useState(/** @type {RecipeListItem[]} */ ([]));
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false; // 빠르게 페이지를 바꿀 때 이전 응답이 늦게 와서 덮어쓰는 것 방지

    const fetchRecipes = async () => {
      setIsLoading(true);
      setError("");
      try {
        // keyword 는 비어 있으면 아예 빼서 전체 조회와 동일하게 동작시킨다(스펙)
        const params = { page: page - 1, size: PAGE_SIZE };
        if (appliedKeyword) params.keyword = appliedKeyword;

        const res = await getRecipeList(params);
        if (ignore) return;
        /** @type {RecipeListResponse} */
        const data = res?.data ?? { recipes: [], pageInfo: { totalPages: 1 } };
        setRecipes(data.recipes ?? []);
        setTotalPages(data.pageInfo?.totalPages ?? 1);
      } catch (err) {
        if (ignore) return;
        // 인터셉터가 { code, msg, data, status } 로 reject → 서버 msg 그대로 노출
        setError(err?.msg ?? "레시피 목록을 불러오지 못했습니다.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchRecipes();
    return () => {
      ignore = true;
    };
  }, [page, appliedKeyword]);

  // 검색 버튼 클릭 또는 인풋에서 엔터(form submit) → 검색어 확정 + 1페이지부터 다시 조회
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    setAppliedKeyword(keyword.trim());
  };

  return (
    <PageWrapper className="container">
      <TopRow>
        <Button as={Link} to={RECIPE_FORM_PATH} variant="primary">
          조리법 등록하기
        </Button>
      </TopRow>

      <FilterRow>
        {/* 필터는 아직 명세에 파라미터가 없어 비활성 (준비 중) */}
        <Button variant="secondary" disabled title="필터 기능 준비 중">
          필터 변경
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
                onPageChange={setPage}
              />
            </PaginationWrap>
          </>
        )}
      </ContentArea>
    </PageWrapper>
  );
}

export default RecipeListPage;
