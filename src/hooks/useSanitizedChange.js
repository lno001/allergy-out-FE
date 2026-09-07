import { useRef } from "react";

/**
 * 제어 컴포넌트에서 입력값을 실시간 정제(sanitize)할 때 IME 조합을 깨지 않도록 하는 change 핸들러 세트.
 *
 * onChange 안에서 값을 바꾸면(예: 한글 자모 제거) 진행 중이던 조합이 취소돼,
 * 한글 키보드 상태에서는 영문 입력까지 씹힌다. 조합 중에는 원문을 그대로 두고,
 * 조합이 아닐 때 / 조합이 끝났을 때만 sanitize 를 적용한다.
 *
 * @param {(raw: string) => string} sanitize - 허용문자만 남기는 함수 (memberValidation 의 sanitize*)
 * @param {(value: string) => void} onValue - 최종 값을 상태에 반영하는 콜백
 * @returns {{ onChange: Function, onCompositionStart: Function, onCompositionEnd: Function }}
 *   <Input> 에 그대로 spread 한다.
 */
export default function useSanitizedChange(sanitize, onValue) {
  const composingRef = useRef(false);

  return {
    onChange: (event) => {
      const raw = event.target.value;
      onValue(composingRef.current ? raw : sanitize(raw));
    },
    onCompositionStart: () => {
      composingRef.current = true;
    },
    onCompositionEnd: (event) => {
      composingRef.current = false;
      onValue(sanitize(event.target.value));
    },
  };
}
