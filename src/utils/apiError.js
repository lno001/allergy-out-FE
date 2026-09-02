/**
 * 서버 에러 봉투를 폼에서 쓰기 좋게 "필드별 에러"와 "폼 전체 메시지"로 나눈다.
 *
 * 백엔드 계약 (global/exception/GlobalExceptionHandler · ErrorCode):
 * - 실패 응답 = { code: <HTTP status>, msg: <분류/구체 문구>, data: <상세 | null> }
 *   (HTTP status 도 code 와 동일 — axiosInstance 인터셉터가 { code, msg, data, status } 로 reject)
 *
 * - data 가 { 필드명: 구체메시지 } 맵인 경우 → 해당 Input 밑에 인라인 표시:
 *     · INVALID_INPUT_VALUE (400) — @Valid 형식 검증 실패, "기존 값과 동일합니다" 류
 *     · DUPLICATE_VALUE     (409) — 이미 사용 중인 이메일/연락처
 *
 * - data 가 없는 경우 → msg 자체가 완성된 문구다. 특정 필드에 붙이지 말고
 *   폼 전체 메시지(토스트 등)로 노출:
 *     · PASSWORD_MISMATCH, PASSWORD_SAME_AS_OLD, IMAGE_ALREADY_DEFAULT (400)
 *     · UNAUTHORIZED (401), INTERNAL_SERVER_ERROR (500), 네트워크 오류
 *
 * @param {{ msg?: string, data?: Record<string, string> | null }} err
 * @returns {{ fieldErrors: Record<string, string>, formMessage: string | null }}
 */
export function splitFormError(err) {
  const data = err?.data;
  // 필드 맵이 실제로 키를 가질 때만 인라인 처리. 빈 객체({})거나 없으면
  // msg 를 폼 전체 메시지로 → "실패했는데 화면엔 아무것도 안 뜨는" 상황 방지.
  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Object.keys(data).length > 0
  ) {
    return { fieldErrors: data, formMessage: null };
  }
  return {
    fieldErrors: {},
    formMessage: err?.msg || "요청을 처리하지 못했습니다.",
  };
}
