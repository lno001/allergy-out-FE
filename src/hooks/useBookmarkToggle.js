import { useContext, useEffect, useRef, useState } from "react";

import { createBookmark, deleteBookmark } from "../apis/bookmarkApi";
import { ToastContext } from "../components/common/ToastProvider";
import { useAuth } from "./useAuth";

/**
 * 레시피 한 건의 즐겨찾기 토글 (낙관적 갱신).
 *
 * - 비로그인: toggle 시 안내 토스트만, 요청은 안 보낸다.
 * - 등록 409(이미 즐겨찾기함) / 해제 404(이미 해제됨) → 성공으로 흡수(멱등).
 * - 그 외 실패 → 상태 롤백 + danger 토스트 (onCommit 은 호출하지 않음).
 * - initialBookmarked 가 처음엔 undefined(상세 로딩 중)였다가 값이 오면 그때 한 번만 seed.
 *   그 뒤 사용자가 누른 결과는 유지한다(재조회로 덮어쓰지 않음).
 * - recipeNo 가 바뀌면(상세→상세 이동으로 컴포넌트가 안 풀릴 때) seed 상태를 리셋해
 *   새 레시피의 initialBookmarked 로 다시 seed 한다.
 *
 * @param {{
 *   recipeNo: number,
 *   initialBookmarked?: boolean,
 *   onCommit?: (bookmarked: boolean) => void,
 * }} params
 *   onCommit: 서버에 반영이 확정됐을 때(성공 또는 멱등 흡수) 호출. 목록 화면이 재조회로
 *   목록·페이지수를 재동기화하는 훅. 하드 실패(롤백) 시엔 호출되지 않는다.
 * @returns {{ bookmarked: boolean, pending: boolean, toggle: () => void }}
 */
export default function useBookmarkToggle({
  recipeNo,
  initialBookmarked,
  onCommit,
}) {
  const { user } = useAuth();
  const showToast = useContext(ToastContext);
  const [bookmarked, setBookmarked] = useState(Boolean(initialBookmarked));
  const [pending, setPending] = useState(false);
  const seededRef = useRef(initialBookmarked !== undefined);
  const seededKeyRef = useRef(recipeNo);

  useEffect(() => {
    // recipeNo 가 바뀌면 이전 레시피의 seed 를 버리고 새로 seed 대상으로 표시.
    if (seededKeyRef.current !== recipeNo) {
      seededKeyRef.current = recipeNo;
      seededRef.current = initialBookmarked !== undefined;
      setBookmarked(Boolean(initialBookmarked));
      return;
    }
    if (!seededRef.current && initialBookmarked !== undefined) {
      seededRef.current = true;
      setBookmarked(Boolean(initialBookmarked));
    }
  }, [recipeNo, initialBookmarked]);

  const toggle = () => {
    if (!user) {
      showToast?.("로그인 후 이용해 주세요.", "info");
      return;
    }
    if (pending) return;

    const next = !bookmarked;
    setBookmarked(next); // 낙관적 반영
    setPending(true);

    const request = next ? createBookmark(recipeNo) : deleteBookmark(recipeNo);
    request.then(
      () => {
        setPending(false);
        onCommit?.(next);
      },
      (err) => {
        setPending(false);
        const status = err?.code ?? err?.status;
        if ((next && status === 409) || (!next && status === 404)) {
          onCommit?.(next); // 멱등 — 성공 취급
          return;
        }
        setBookmarked(!next); // 롤백
        showToast?.(
          next ? "즐겨찾기에 실패했습니다." : "즐겨찾기 해제에 실패했습니다.",
          "danger",
        );
      },
    );
  };

  return { bookmarked, pending, toggle };
}
