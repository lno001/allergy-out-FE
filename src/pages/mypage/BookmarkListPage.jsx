import { useContext } from "react";

import { deleteBookmark } from "../../apis/bookmarkApi";
import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import { ToastContext } from "../../components/common/ToastProvider";
import RecipeCard from "../../components/recipe/RecipeCard";
import { RecipeCardGrid } from "../../components/recipe/RecipeCard.styled";
import useBookmarkList from "../../hooks/useBookmarkList";
import {
  CardWrap,
  Content,
  EmptyState,
  GridArea,
  HeartButton,
  PageBanner,
  PaginationWrap,
  SectionDescription,
  SectionTitle,
} from "./BookmarkListPage.styled";

/**
 * 마이페이지 — "즐겨찾는 레시피" 탭. path: /mypage/bookmark
 *
 * 하트 클릭 = 즐겨찾기 즉시 해제. 재조회 없이 로컬에서 카드만 빼고(optimistic) DELETE 를
 * 백그라운드로 보낸다 → 목록 깜빡임 없음. 404(이미 해제됨)는 성공 취급(멱등),
 * 그 외 실패면 카드를 되돌리고 토스트.
 */
function BookmarkListPage() {
  const showToast = useContext(ToastContext);
  const {
    page,
    setPage,
    recipes,
    setRecipes,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
  } = useBookmarkList();

  const handleUnbookmark = (recipeNo) => {
    const snapshot = recipes;
    setRecipes((rs) => rs.filter((r) => r.recipeNo !== recipeNo));

    deleteBookmark(recipeNo).catch((err) => {
      if (err?.code === 404 || err?.status === 404) return; // 이미 해제됨 — 멱등 취급
      setRecipes(snapshot); // 롤백
      showToast?.("즐겨찾기 해제에 실패했습니다.", "danger");
    });
  };

  return (
    <CardWrap>
      <PageBanner />
      <Content>
        <SectionTitle>즐겨찾는 레시피</SectionTitle>
        <SectionDescription>
          내가 북마크하고 나의 알러지 정보 필터에 맞춰 안전하게 보관해 둔 나만의 단골
          레시피 모음입니다.
        </SectionDescription>

        {isLoading ? (
          <Loading label="즐겨찾는 레시피를 불러오는 중입니다." />
        ) : isError ? (
          <Alert variant="danger">
            {error?.msg || "즐겨찾는 레시피를 불러오지 못했습니다."}
          </Alert>
        ) : recipes.length === 0 ? (
          <EmptyState>아직 즐겨찾는 레시피가 없습니다.</EmptyState>
        ) : (
          <>
            <GridArea $dim={isFetching}>
              <RecipeCardGrid>
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.recipeNo}
                    recipe={recipe}
                    overlay={
                      <HeartButton
                        type="button"
                        aria-label="즐겨찾기 해제"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleUnbookmark(recipe.recipeNo);
                        }}
                      >
                        ❤️
                      </HeartButton>
                    }
                  />
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

export default BookmarkListPage;
