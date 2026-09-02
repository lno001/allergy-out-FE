import { useCallback, useEffect, useRef, useState } from "react";

import { getMember } from "../apis/memberApi";

/**
 * 마이페이지 회원 정보 조회 훅.
 * 최초 로드(isLoading)와 저장 후 재조회(isRefetching)를 구분한다 — 구분 안 하면
 * 모달에서 저장할 때마다 화면 전체가 풀스크린 로딩으로 깜빡인다.
 *
 * @param {boolean} [enabled=true] - false면 조회를 미룬다 (예: 인증 부트스트랩이
 *   끝나기 전 = access 토큰이 아직 메모리에 없을 때). enabled가 true로 바뀌면 그때 조회.
 *   미룰 동안 isLoading은 true로 유지된다.
 * @returns {{
 *   data: import('../apis/memberApi').MemberInfo|null,
 *   isLoading: boolean,
 *   isRefetching: boolean,
 *   isError: boolean,
 *   error: { code: number, msg: string, data: object|null, status: number }|null,
 *   refetch: () => void,
 * }}
 */
function useMember(enabled = true) {
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
    if (enabled) {
      fetchMember();
    }
  }, [enabled, fetchMember]);

  return { data, isLoading, isRefetching, isError: !!error, error, refetch: fetchMember };
}

export default useMember;
