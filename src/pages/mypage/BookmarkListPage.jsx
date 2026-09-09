import { useEffect } from "react";

import Alert from "../../components/common/Alert";
import Loading from "../../components/common/Loading";
import Pagination from "../../components/common/Pagination";
import RecipeCard from "../../components/recipe/RecipeCard";
import { RecipeCardGrid } from "../../components/recipe/RecipeCard.styled";
import useBookmarkList from "../../hooks/useBookmarkList";
import {
  CardWrap,
  Content,
  EmptyState,
  GridArea,
  PageBanner,
  PaginationWrap,
  SectionDescription,
  SectionTitle,
} from "./BookmarkListPage.styled";

/**
 * 마이페이지 — "즐겨찾는 레시피" 탭. path: /mypage/bookmark
 *
 * 목록의 모든 카드는 정의상 즐겨찾기된 상태이므로 isBookmarked 를 항상 true 로 넘긴다
 * (BE 응답에 필드가 없어도 하트가 채워진 상태로 뜨게).
 *
 * 하트로 해제하면 그 변경이 "서버에 반영 확정"된 시점(onBookmarkCommit)에 현재 페이지를
 * 다시 불러(refetch) 목록과 totalPages 를 재동기화한다. 로컬에서 카드만 빼는 낙관적 방식은
 * totalElements/totalPages 가 어긋나 "빈 페이지에 갇힘", "사라진 페이지 버튼이 남음" 같은
 * 페이지네이션 버그를 만들어서 서버를 신뢰하는 쪽으로 바꿨다.
 *
 * 재조회 결과 이 페이지가 비었고 1페이지가 아니면 1페이지로 되돌린다.
 */
function BookmarkListPage() {
  const {
    page,
    setPage,
    recipes,
    totalPages,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useBookmarkList();

  // 해제가 서버에 확정됐을 때. (재-즐겨찾기 방향은 이 화면에서 발생 안 함)
  // - 마지막 카드였다면 현재 페이지는 곧 사라진다 → 재조회하면 404/400 → 앞 페이지로 이동(항상 존재).
  // - 아니면 현재 페이지를 다시 읽어 목록·totalPages 재동기화. (해제 1번당 GET 1번)
  const handleBookmarkCommit = (bookmarked) => {
    if (bookmarked) return;
    if (recipes.length <= 1 && page > 1) setPage(page - 1);
    else refetch();
  };

  // 안전망: 재조회 결과 이 페이지가 비었거나(빈 배열) 죽은 페이지라 에러가 났고,
  // 1페이지가 아니면 1페이지로 되돌린다. (수동 URL 진입 등 위 경로를 안 탄 경우까지)
  useEffect(() => {
    if (isLoading || isFetching || page <= 1) return;
    if (isError || recipes.length === 0) setPage(1);
  }, [recipes.length, isLoading, isFetching, isError, page, setPage]);

  const showLoading = isLoading || (isFetching && recipes.length === 0);

  return (
    <CardWrap>
      <PageBanner />
      <Content>
        <SectionTitle>즐겨찾는 레시피</SectionTitle>
        <SectionDescription>
          내가 북마크하고 나의 알러지 정보 필터에 맞춰 안전하게 보관해 둔 나만의 단골
          레시피 모음입니다.
        </SectionDescription>

        {showLoading ? (
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
                    recipe={{ ...recipe, isBookmarked: true }}
                    onBookmarkCommit={handleBookmarkCommit}
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
