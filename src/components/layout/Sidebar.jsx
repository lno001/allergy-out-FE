import { useLocation } from "react-router-dom";

import { SidebarLink, SidebarNav } from "./layout.styled";

const MYPAGE_LINKS = [
  { label: "계정 관리", path: "/mypage/account" },
  { label: "알러지 필터 관리", path: "/mypage/allergy" },
  { label: "즐겨찾기 레시피", path: "/mypage/bookmarks" },
  { label: "내 정보 관리", path: "/mypage/profile" },
];

/**
 * 마이페이지 좌측 사이드바. 다른 마이페이지 하위 화면(계정/즐겨찾기/정보)은
 * 아직 라우트가 없어서 링크만 걸어두고, 현재 경로와 일치하는 것만 활성 표시합니다.
 */
function Sidebar() {
  const location = useLocation();

  return (
    <SidebarNav aria-label="마이페이지 메뉴">
      {MYPAGE_LINKS.map((link) => (
        <SidebarLink
          key={link.path}
          href={link.path}
          $active={location.pathname === link.path}
        >
          {link.label}
        </SidebarLink>
      ))}
    </SidebarNav>
  );
}

export default Sidebar;
