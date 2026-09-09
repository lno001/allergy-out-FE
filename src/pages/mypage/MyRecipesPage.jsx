import { Link } from "react-router-dom";

import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import RecipeCard from "../../components/recipe/RecipeCard";
import { RecipeCardGrid } from "../../components/recipe/RecipeCard.styled";
import useMyRecipes from "../../hooks/useMyRecipes";
import {
  CardWrap,
  Content,
  EmptyState,
  GridArea,
  PageBanner,
  PaginationWrap,
  SectionDescription,
  SectionTitle,
} from "./MyRecipesPage.styled";

/**
 * 마이페이지 — "내 작성 레시피" 탭. path: /mypage/recipes
 *
 * GET /api/recipes/me (인증 필수, page/size). 카드는 즐겨찾기 목록 탭과 같은 공용
 * RecipeCard 를 쓰고, 썸네일 하트로 그 자리에서 즐겨찾기 토글만 한다(목록에서 빼지 않음
 * — 여기 기준은 "작성" 이지 "즐겨찾기" 가 아니므로).
 */
function MyRecipesPage() {
  const {
    page,
    setPage,
    recipes,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
  } = useMyRecipes();

  return (
    <CardWrap>
      <PageBanner />
      <Content>
        <SectionTitle>내 작성 레시피</SectionTitle>
        <SectionDescription>
          내가 등록한 조리법 모음입니다. 카드를 누르면 상세로 이동합니다.
        </SectionDescription>

        {isLoading ? (
          <Loading label="내 레시피를 불러오는 중입니다." />
        ) : isError ? (
          <Alert variant="danger">
            {error?.msg || "내 레시피를 불러오지 못했습니다."}
          </Alert>
        ) : recipes.length === 0 ? (
          <EmptyState>
            아직 작성한 레시피가 없습니다.{" "}
            <Link to="/recipe/form">첫 조리법 등록하기</Link>
          </EmptyState>
        ) : (
          <>
            <GridArea $dim={isFetching}>
              <RecipeCardGrid>
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.recipeNo} recipe={recipe} />
                ))}
              </RecipeCardGrid>
            </GridArea>

            <PaginationWrap>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </PaginationWrap>
          </>
        )}
      </Content>
    </CardWrap>
  );
}

export default MyRecipesPage;
