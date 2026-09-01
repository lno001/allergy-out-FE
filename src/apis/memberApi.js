import axiosInstance from "./axiosInstance";

/** [마이] 회원 정보 조회 — GET /api/members */
export function getMember() {
  return axiosInstance.get("/members");
}

/** [마이] 이름 변경 — PATCH /api/members/membername */
export function updateMemberName(memberName) {
  return axiosInstance.patch("/members/membername", { memberName });
}

/** [마이] 이메일 변경 — PATCH /api/members/email */
export function updateMemberEmail(email) {
  return axiosInstance.patch("/members/email", { email });
}

/** [마이] 연락처 변경 — PATCH /api/members/phone */
export function updateMemberPhone(phone) {
  return axiosInstance.patch("/members/phone", { phone });
}

/**
 * [마이] 비밀번호 변경 — PATCH /api/members/memberpwd
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export function updateMemberPassword(payload) {
  return axiosInstance.patch("/members/memberpwd", payload);
}

/**
 * [마이] 프로필 사진 변경 — PATCH /api/members/memberimg (multipart/form-data)
 * @param {File} imageFile jpg / jpeg / png 등 이미지 파일
 */
export function updateMemberImage(imageFile) {
  const formData = new FormData();
  formData.append("memberImg", imageFile);
  // FormData 를 넘기면 axios 가 Content-Type(boundary 포함)을 자동으로 설정합니다.
  return axiosInstance.patch("/members/memberimg", formData);
}

/** [마이] 기본 프로필로 변경(프로필 사진 삭제) — DELETE /api/members/memberimg */
export function deleteMemberImage() {
  return axiosInstance.delete("/members/memberimg");
}

/**
 * [마이] 회원 탈퇴 — DELETE /api/members
 * DELETE 는 body 를 `data` 옵션으로 실어 보냅니다.
 * @param {string} memberPwd
 */
export function deleteMember(memberPwd) {
  return axiosInstance.delete("/members", { data: { memberPwd } });
}

/**
 * [마이] 내 작성 레시피 목록 — GET /api/members/recipes
 * @param {{ page?: number, size?: number }} [params] 예: { page: 0, size: 6 }
 */
export function getMyRecipes(params) {
  return axiosInstance.get("/members/recipes", { params });
}
