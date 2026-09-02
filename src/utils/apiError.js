/**
 * axiosInstance가 통일해서 reject하는 { code, msg, data, status } 에러에서,
 * 특정 필드의 검증 메시지를 꺼낸다. 필드별 메시지가 없으면(data: null 케이스 등)
 * 서버가 준 분류 메시지(msg)로 대체한다.
 *
 * @param {{ msg: string, data: object|null }} err
 * @param {string} field
 * @returns {string}
 */
export function pickFieldError(err, field) {
  return err?.data?.[field] || err?.msg || "요청을 처리하지 못했습니다.";
}
