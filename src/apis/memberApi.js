import axiosInstance from "./axiosInstance";

/**
 * 마이페이지 API — 명세 버전: 2026-09-01 마이페이지 API 명세서(구현 반영 통합본).
 * base path는 전부 `/members` (복수형). 이전 초안(`/member` 단수)은 폐기.
 */

/**
 * @typedef {Object} MemberInfo
 * @property {string} memberId
 * @property {string|null} memberImgPath - 프로필 사진 없으면 null
 * @property {string} memberName
 * @property {string} phone
 * @property {string} email
 * @property {string} createDate - LocalDateTime 문자열 (yyyy-MM-ddTHH:mm:ss)
 */

/**
 * [마이] 회원 정보 조회 — GET /api/members
 * @returns {Promise<{ code: number, msg: string, data: MemberInfo }>}
 */
export function getMember() {
  return axiosInstance.get("/members");
}

/**
 * [마이] 이름 수정 — PATCH /api/members/membername (2~30자)
 * @param {string} memberName
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
 */
export function updateMemberPhone(phone) {
  return axiosInstance.patch("/members/phone", { phone });
}

/**
 * [마이] 비밀번호 변경 — PATCH /api/members/memberpwd
 * 새 비밀번호 규칙: 영문+숫자 포함 8~20자
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export function updateMemberPassword(payload) {
  return axiosInstance.patch("/members/memberpwd", payload);
}

/**
 * [마이] 프로필 사진 수정 — PATCH /api/members/memberimg (multipart/form-data)
 * jpg/jpeg/png/gif/webp, 5MB 이하
 * @param {File} imageFile
 * @returns {Promise<{ code: number, msg: string, data: { memberImgPath: string } }>}
 */
export function updateMemberImage(imageFile) {
  const formData = new FormData();
  formData.append("memberImg", imageFile);
  return axiosInstance.patch("/members/memberimg", formData);
}

/** [마이] 프로필 사진 삭제(기본 프로필로) — DELETE /api/members/memberimg */
export function deleteMemberImage() {
  return axiosInstance.delete("/members/memberimg");
}

/**
 * [마이] 회원 탈퇴 — DELETE /api/members
 * 성공하면 서버가 refresh 토큰/쿠키는 정리하지만 access 토큰은 못 지운다.
 * // TODO(T-5 연동): 호출부에서 성공 시 tokenStorage.clearAccessToken() 실행 후 /login 이동.
 * @param {string} memberPwd
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
