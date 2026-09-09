import { useEffect, useRef, useState } from "react";

import { getMyRecipes } from "../apis/recipeApi";

/** 디자인상 한 페이지 3x2 = 6개 (즐겨찾기 탭과 동일). API 기본 size 는 20. */
export const MY_RECIPES_PAGE_SIZE = 6;

/**
 * 내가 작성한 레시피 목록 조회 훅 — GET /api/recipes/me (인증 필수).
 * useBookmarkList 와 같은 구조: 최초 로드(isLoading)와 페이지 전환(isFetching) 분리.
 *
 * @returns {{
 *   page: number, setPage: (p: number) => void,
 *   recipes: any[], setRecipes: import('react').Dispatch<import('react').SetStateAction<any[]>>,
 *   totalPages: number,
 *   isLoading: boolean, isFetching: boolean, isError: boolean,
 *   error: { code: number, msg: string, data: object|null, status: number }|null,
 * }}
 */
function useMyRecipes() {
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

    getMyRecipes({ page: page - 1, size: MY_RECIPES_PAGE_SIZE })
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

export default useMyRecipes;
