import axiosInstance from "./axiosInstance";

/** [마이] 회원 정보 조회 — GET /api/member */
export function getMember() {
  return axiosInstance.get("/member");
}

/** [마이] 이름 변경 — PATCH /api/member/membername */
export function updateMemberName(memberName) {
  return axiosInstance.patch("/member/membername", { memberName });
}

/** [마이] 이메일 변경 — PATCH /api/member/email */
export function updateMemberEmail(email) {
  return axiosInstance.patch("/member/email", { email });
}

/** [마이] 연락처 변경 — PATCH /api/member/phone */
export function updateMemberPhone(phone) {
  return axiosInstance.patch("/member/phone", { phone });
}

/**
 * [마이] 비밀번호 변경 — PATCH /api/member/memberpwd
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export function updateMemberPassword(payload) {
  return axiosInstance.patch("/member/memberpwd", payload);
}

/**
 * [마이] 프로필 사진 변경 — PATCH /api/member/memberImg (multipart/form-data)
 * @param {File} imageFile jpg / jpeg / png 등 이미지 파일
 */
export function updateMemberImage(imageFile) {
  const formData = new FormData();
  formData.append("memberImg", imageFile);
  // FormData 를 넘기면 axios 가 Content-Type(boundary 포함)을 자동으로 설정합니다.
  return axiosInstance.patch("/member/memberImg", formData);
}

/** [마이] 기본 프로필로 변경(프로필 사진 삭제) — DELETE /api/member/memberImg */
export function deleteMemberImage() {
  return axiosInstance.delete("/member/memberImg");
}

/**
 * [마이] 회원 탈퇴 — DELETE /api/member
 * DELETE 는 body 를 `data` 옵션으로 실어 보냅니다.
 * @param {string} memberPwd
 */
export function deleteMember(memberPwd) {
  return axiosInstance.delete("/member", { data: { memberPwd } });
}

/**
 * [마이] 내 작성 레시피 목록 — GET /api/member/recipes
 * @param {{ page?: number, size?: number }} [params] 예: { page: 0, size: 6 }
 */
export function getMyRecipes(params) {
  return axiosInstance.get("/member/recipes", { params });
}
