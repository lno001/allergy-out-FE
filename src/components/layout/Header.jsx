import { HeaderBar, HeaderLogo, HeaderNav, HeaderNavLink } from "./layout.styled";

/**
 * 사이트 공통 헤더. 로고 + 최소 내비게이션만 담당합니다.
 * 로그인 사용자 정보 표시는 이후 T-5(인증 골격)에서 useAuth 훅이 붙으면 연결합니다
 * (지금은 로그인 상태를 아는 방법이 없어 정적으로만 둡니다).
 */
function Header() {
  return (
    <HeaderBar>
      <HeaderLogo href="/">🛡️ Allergy Out</HeaderLogo>
      <HeaderNav>
        <HeaderNavLink href="/">홈</HeaderNavLink>
        <HeaderNavLink href="/mypage/allergy">마이페이지</HeaderNavLink>
      </HeaderNav>
    </HeaderBar>
  );
}

export default Header;
