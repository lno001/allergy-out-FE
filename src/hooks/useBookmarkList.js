import { useEffect, useRef, useState } from "react";

import { getBookmarkList } from "../apis/bookmarkApi";

/** 디자인상 한 페이지 3x2 = 6개. (API 기본 size 는 20) */
export const BOOKMARK_PAGE_SIZE = 6;

/**
 * 즐겨찾기 목록 조회 훅.
 * - page 는 Pagination 기준 1-based, 서버 요청 시 page-1 로 변환
 * - 최초 로드(isLoading)와 페이지 전환(isFetching)을 분리 → 페이지 넘길 때 기존 목록을
 *   유지한 채(살짝 흐리게) 새 데이터로 교체 → 빈 화면 깜빡임 없음
 * - recipes 를 setRecipes 로 노출 → 하트 해제 시 재조회 없이 로컬에서 카드만 제거(optimistic)
 *
 * @returns {{
 *   page: number, setPage: (p: number) => void,
 *   recipes: import('../apis/bookmarkApi').BookmarkListItem[],
 *   setRecipes: import('react').Dispatch<import('react').SetStateAction<any[]>>,
 *   totalPages: number,
 *   isLoading: boolean, isFetching: boolean, isError: boolean,
 *   error: { code: number, msg: string, data: object|null, status: number }|null,
 * }}
 */
function useBookmarkList() {
  const [page, setPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const loadedOnce = useRef(false);

  useEffect(() => {
    let alive = true;
    if (loadedOnce.current) setIsFetching(true);
    else setIsLoading(true);
    setError(null);

    getBookmarkList({ page: page - 1, size: BOOKMARK_PAGE_SIZE })
      .then((res) => {
        if (!alive) return;
        setRecipes(res.data.recipes);
        setTotalPages(res.data.pageInfo.totalPages);
      })
      .catch((err) => {
        if (alive) setError(err);
      })
      .finally(() => {
        if (!alive) return;
        setIsLoading(false);
        setIsFetching(false);
        loadedOnce.current = true;
      });

    return () => {
      alive = false;
    };
  }, [page]);

  return {
    page,
    setPage,
    recipes,
    setRecipes,
    totalPages,
    isLoading,
    isFetching,
    isError: !!error,
    error,
  };
}

export default useBookmarkList;
