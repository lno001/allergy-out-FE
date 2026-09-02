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
 * RecipeListPage  (route: /recipes)
 * -----------------------------------------------------------------------------
 * 회원·비회원이 레시피(조리법) 게시판에 들어왔을 때 목록을 보여주는 화면.
 * 명세: 조리법 목록 조회 V1.4 — GET /api/recipes?page=&size=
 *
 * - 인증: 회원이면 토큰이 자동 첨부되어 백엔드가 알러지 재료를 뺀 목록을 준다.
 *   비회원이면 전체 목록. 프론트는 동일하게 호출만 하고 분기하지 않는다.
 * - 명세 V1.4 에는 검색·필터 파라미터가 없어, 검색창/"필터 변경"은 지금 비활성 UI 다
 *   (figma 레이아웃 유지용, 파라미터가 명세에 생기면 연결).
 * - 헤더/푸터는 components/layout 담당. 라우트 등록(App.jsx)은 이번 범위 아님.
 * - props 없음 → @typedef(props) 두지 않음 (CLAUDE.md 2.[작명]).
 */

/**
 * @typedef {Object} RecipeListItem
 * @property {number} recipeNo
 * @property {string} recipeTitle
 * @property {string} recipeMainImg   대표 이미지 URL
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

function RecipeListPage() {
  const [page, setPage] = useState(1); // 화면/Pagination 은 1부터, 서버는 0부터 → 요청 시 -1
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
        const res = await getRecipeList({ page: page - 1, size: PAGE_SIZE });
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
  }, [page]);

  return (
    <PageWrapper className="container">
      <TopRow>
        <Button as={Link} to={RECIPE_FORM_PATH} variant="primary">
          조리법 등록하기
        </Button>
      </TopRow>

      <FilterRow>
        {/* 명세 V1.4 에 필터/검색 파라미터가 없어 지금은 비활성 (준비 중) */}
        <Button variant="secondary" disabled title="필터 기능 준비 중">
          필터 변경
        </Button>
        <SearchInput
          type="search"
          disabled
          placeholder="안전한 재료, 레시피를 검색해보세요"
          aria-label="레시피 검색 (준비 중)"
        />
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
                  <RecipeCard to={`/recipes/${recipe.recipeNo}`}>
                    <CardThumb>
                      <img
                        src={recipe.recipeMainImg}
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
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </PaginationWrap>
          </>
        )}
      </ContentArea>
    </PageWrapper>
  );
}

export default RecipeListPage;
