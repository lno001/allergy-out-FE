import axiosInstance from "./axiosInstance";

/**
 * 마이페이지 API — 명세 버전: 2026-09-01 마이페이지 API 명세서(구현 반영 통합본).
 * base path는 전부 `/members` (복수형). 이전 초안(`/member` 단수)은 폐기.
 */

/**
 * 회원 정보 (GET /api/members 응답 data). 백엔드 MemberResponse record 와 키 일치.
 * @typedef {Object} MemberInfo
 * @property {string} memberId
 * @property {string|null} memberImgPath - 프로필 사진 S3 URL. 없으면 null
 * @property {string} memberName
 * @property {string} phone
 * @property {string} email
 * @property {string} createDate - LocalDateTime 직렬화 문자열 (yyyy-MM-ddTHH:mm:ss)
 */

/**
 * 백엔드 공통 응답 봉투(성공). 실패는 axiosInstance 인터셉터가
 * { code, msg, data, status } 로 reject 한다 (utils/apiError.js `splitFormError` 참고).
 * @template T
 * @typedef {{ code: number, msg: string, data: T }} ApiOk
 */

/**
 * [마이] 회원 정보 조회 — GET /api/members
 * @returns {Promise<ApiOk<MemberInfo>>}
 */
export function getMember() {
  return axiosInstance.get("/members");
}

/**
 * [마이] 이름 수정 — PATCH /api/members/membername (2~30자)
 * @param {string} memberName
 * @returns {Promise<ApiOk<{ memberName: string }>>} - 백엔드 MemberNameResponse
 */
export function updateMemberName(memberName) {
  return axiosInstance.patch("/members/membername", { memberName });
}

/**
 * [마이] 이메일 수정 — PATCH /api/members/email
 * 서버가 소문자로 정규화해서 저장/비교한다 (Foo@X.com → foo@x.com).
 *
 * // TODO(이메일 인증 API): 지금은 인증번호 발송/확인 API가 없어서(명세서에 "미구현"
 * // 으로 명시됨) 바로 PATCH한다. 인증 API가 생기면 이 함수 호출 전에
 * // requestEmailVerification(email) / verifyEmailCode(email, code) 단계를 추가할 것.
 * @param {string} email
 * @returns {Promise<ApiOk<{ email: string }>>} - 백엔드 MemberEmailResponse. data.email 은 소문자 정규화된 값
 */
export function updateMemberEmail(email) {
  return axiosInstance.patch("/members/email", { email });
}

/**
 * [마이] 연락처 수정 — PATCH /api/members/phone (010 + 숫자 8자리, 하이픈 없음)
 *
 * // TODO(연락처 인증 API): 이메일과 동일 — 인증 API 없어서 바로 PATCH한다.
 * // 생기면 requestPhoneVerification(phone) / verifyPhoneCode(phone, code) 추가할 것.
 * @param {string} phone
 * @returns {Promise<ApiOk<{ phone: string }>>} - 백엔드 MemberPhoneResponse
 */
export function updateMemberPhone(phone) {
  return axiosInstance.patch("/members/phone", { phone });
}

/**
 * [마이] 비밀번호 변경 — PATCH /api/members/memberpwd
 * 새 비밀번호 규칙: 영문+숫자 포함 8~20자
 * @param {{ currentPassword: string, newPassword: string }} payload
 * @returns {Promise<ApiOk<null>>} - 성공 시 data 없음 (msg 만)
 */
export function updateMemberPassword(payload) {
  return axiosInstance.patch("/members/memberpwd", payload);
}

/**
 * [마이] 프로필 사진 수정 — PATCH /api/members/memberimg (multipart/form-data)
 * jpg/jpeg/png/gif/webp, 5MB 이하
 * @param {File} imageFile
 * @returns {Promise<ApiOk<{ memberImgPath: string }>>} - 백엔드 MemberImgResponse (새 S3 URL)
 */
export function updateMemberImage(imageFile) {
  const formData = new FormData();
  formData.append("memberImg", imageFile);
  return axiosInstance.patch("/members/memberimg", formData);
}

/**
 * [마이] 프로필 사진 삭제(기본 프로필로) — DELETE /api/members/memberimg
 * 이미 기본 프로필이면 400 IMAGE_ALREADY_DEFAULT ("이미 기본 프로필 사진입니다.", data 없음).
 * @returns {Promise<ApiOk<null>>}
 */
export function deleteMemberImage() {
  return axiosInstance.delete("/members/memberimg");
}

/**
 * [마이] 회원 탈퇴 — DELETE /api/members
 * 성공하면 서버가 refresh 토큰/쿠키는 정리하지만 access 토큰은 못 지운다.
 * 호출부(ProfileEditPage)가 성공 시 useAuth().logout() 으로 access 토큰(메모리)을
 * 비우고 홈으로 이동한다.
 * 비밀번호 불일치 → 400 PASSWORD_MISMATCH (data 없음), 미입력 → 400 { memberPwd: "..." }.
 * @param {string} memberPwd - 백엔드 MemberDeleteRequest.memberPwd
 * @returns {Promise<ApiOk<null>>}
 */
export function deleteMember(memberPwd) {
  return axiosInstance.delete("/members", { data: { memberPwd } });
}

/**
 * [마이] 내 작성 레시피 목록 — GET /api/members/recipes
 * 명세서 기준 백엔드 미구현("계획만, 미착수") — 지금 호출하면 실패할 수 있음.
 * @param {{ page?: number, size?: number }} [params]
 */
export function getMyRecipes(params) {
  return axiosInstance.get("/members/recipes", { params });
}
