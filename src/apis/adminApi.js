import axiosInstance from './axiosInstance';

/** [관리자] 회원 목록 (검색어/역할 필터/페이지네이션) */
export function getMemberList(params) {
  return axiosInstance.get('/admin/members', { params });
}

/** [관리자] 회원 역할 변경 (일반회원/운영자/BAN) */
export function updateMemberRole(memberNo, role) {
  return axiosInstance.patch(`/admin/members/${memberNo}/role`, { role });
}
