import { useCallback, useEffect, useRef, useState } from "react";

import { getMember } from "../apis/memberApi";

/**
 * 마이페이지 회원 정보 조회 훅.
 * 최초 로드(isLoading)와 저장 후 재조회(isRefetching)를 구분한다 — 구분 안 하면
 * 모달에서 저장할 때마다 화면 전체가 풀스크린 로딩으로 깜빡인다.
 *
 * @returns {{
 *   data: import('../apis/memberApi').MemberInfo|null,
 *   isLoading: boolean,
 *   isRefetching: boolean,
 *   isError: boolean,
 *   error: { code: number, msg: string, data: object|null, status: number }|null,
 *   refetch: () => void,
 * }}
 */
function useMember() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState(null);
  const hasLoadedOnce = useRef(false);

  const fetchMember = useCallback(() => {
    if (hasLoadedOnce.current) {
      setIsRefetching(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    getMember()
      .then((res) => setData(res.data))
      .catch((err) => setError(err))
      .finally(() => {
        if (hasLoadedOnce.current) {
          setIsRefetching(false);
        } else {
          setIsLoading(false);
          hasLoadedOnce.current = true;
        }
      });
  }, []);

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  return { data, isLoading, isRefetching, isError: !!error, error, refetch: fetchMember };
}

export default useMember;
