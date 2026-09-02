import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import Footer from "./Footer";
import Header from "./Header";

/**
 * 전 페이지 공통 레이아웃 — 헤더 + 본문(Outlet) + 푸터.
 * App.jsx 라우트 정의에서 헤더/푸터 JSX를 걷어내려고 한 곳에 모았다.
 * 인증 상태(user)와 로그아웃은 useAuth 에서 직접 꺼내 쓴다.
 *
 * 로그아웃하면 회원 전용 화면(/mypage 등)에 남지 않도록 홈으로 보낸다.
 */
function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
