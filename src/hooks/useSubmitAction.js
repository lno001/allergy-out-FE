import { useCallback, useState } from "react";

/**
 * 폼 제출 시 반복되는 "submitting 상태 on/off + try/finally" 보일러플레이트만 묶는 훅.
 * 성공/실패 시 무엇을 할지는 호출부가 그대로 작성한다 — 모달마다 다르기 때문.
 *
 * @returns {{
 *   submitting: boolean,
 *   run: (task: () => Promise<void>, options?: { onError?: (err: any) => void }) => Promise<void>,
 * }}
 */
function useSubmitAction() {
  const [submitting, setSubmitting] = useState(false);

  const run = useCallback(async (task, { onError } = {}) => {
    setSubmitting(true);
    try {
      await task();
    } catch (err) {
      onError?.(err);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { submitting, run };
}

export default useSubmitAction;
