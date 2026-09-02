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
} from "./Header.styled";

/**
 * @typedef {Object} HeaderProps
 * @property {'guest'|'member'|'admin'} authState - 로그인 상태 (비회원/회원/관리자)
 * @property {string} [userName] - 회원일 때 아바타 이니셜에 쓸 이름 (예: "김민지")
 * @property {() => void} [onLogout] - 로그아웃 클릭 핸들러
 */

/**
 * 서비스 공통 헤더. authState prop으로 비회원/회원/관리자 3가지 상태를 렌더링한다.
 *
 * 로그인 기능(T-5)이 아직 없어서, 지금은 이 컴포넌트가 상태를 직접 갖지 않고
 * 전부 prop으로만 받는다. 나중에 useAuth 훅이 생기면 이 컴포넌트를 쓰는 쪽
 * (레이아웃/페이지)에서 아래처럼 값을 채워 내려주면 된다 — Header 내부는 안 바뀜.
 *
 * // TODO(T-5 연동): const { authState, userName, logout } = useAuth();
 * // <Header authState={authState} userName={userName} onLogout={logout} />
 *
 * @param {HeaderProps} props
 */
function Header({ authState = "guest", userName = "", onLogout }) {
  const navigate = useNavigate();

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

        {authState === "guest" && (
          <Nav>
            <NavItem to="/login">로그인</NavItem>
            <Button size="sm" onClick={() => navigate("/signup")}>
              회원가입
            </Button>
          </Nav>
        )}

        {authState === "member" && (
          <Nav>
            <NavItem to="/allergy-info">알러지 정보</NavItem>
            <NavItem to="/mypage">마이페이지</NavItem>
            <Avatar
              name={userName}
              size="sm"
              aria-label={userName ? `${userName}님 계정` : "내 계정"}
            />
            <LogoutButton type="button" onClick={onLogout}>
              로그아웃
            </LogoutButton>
          </Nav>
        )}

        {authState === "admin" && (
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
