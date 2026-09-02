import { useNavigate } from "react-router-dom";

import Avatar from "../common/Avatar";
import Button from "../common/Button";
import {
  HeaderBar,
  HeaderInner,
  LogoIcon,
  LogoLink,
  LogoText,
  LogoTextMain,
  LogoTextSub,
  LogoutButton,
  Nav,
  NavItem,
  UserBadge,
  UserName,
} from "./Header.styled";

/* 관리자 판별 role 값. 백엔드 Role enum 기준 — 값이 확정되면 이 줄만 고친다. */
const ADMIN_ROLE = "ROLE_ADMIN";

/**
 * @typedef {Object} AuthUser
 * @property {string} memberId
 * @property {string} memberName
 * @property {string} role
 * @property {string|null} memberImgPath
 *
 * @typedef {Object} HeaderProps
 * @property {AuthUser|null} [user] - 로그인한 회원 (useAuth().user). 비로그인이면 null
 * @property {() => void} [onLogout] - 로그아웃 클릭 핸들러 (useAuth().logout)
 */

/**
 * 서비스 공통 헤더. useAuth().user 를 받아 비회원 / 회원 / 관리자 3가지로 렌더한다.
 *
 * 상태 판단(로그인 여부, 관리자 여부)만 여기서 하고, user·onLogout 은 이 컴포넌트를
 * 쓰는 쪽(App)이 useAuth() 로 꺼내 내려준다. Header 자체는 훅에 의존하지 않으므로
 * preview 갤러리에서 mock user 로 세 상태를 그대로 확인할 수 있다.
 *
 * @param {HeaderProps} props
 */
function Header({ user = null, onLogout }) {
  const navigate = useNavigate();

  const isAdmin = user?.role === ADMIN_ROLE;

  return (
    <HeaderBar>
      <HeaderInner>
        <LogoLink to="/">
          <LogoIcon src="/favicon.svg" alt="" />
          <LogoText>
            <LogoTextMain>알러지 아웃</LogoTextMain>
            <LogoTextSub>ALLERGY OUT</LogoTextSub>
          </LogoText>
        </LogoLink>

        {!user && (
          <Nav>
            <NavItem to="/login">로그인</NavItem>
            <Button size="sm" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </Nav>
        )}

        {user && !isAdmin && (
          <Nav>
            <NavItem to="/allergy-info">알러지 정보</NavItem>
            <NavItem to="/mypage">마이페이지</NavItem>
            <UserBadge>
              <Avatar name={user.memberName} src={user.memberImgPath} size="sm" />
              <UserName>{user.memberName} 님</UserName>
            </UserBadge>
            <LogoutButton type="button" onClick={onLogout}>
              로그아웃
            </LogoutButton>
          </Nav>
        )}

        {user && isAdmin && (
          <Nav>
            <NavItem to="/admin">관리자 페이지</NavItem>
            <LogoutButton type="button" onClick={onLogout}>
              로그아웃
            </LogoutButton>
          </Nav>
        )}
      </HeaderInner>
    </HeaderBar>
  );
}

export default Header;
