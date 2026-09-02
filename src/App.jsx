import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { useAuth } from "./hooks/useAuth";
import Preview from "./preview";
import MyPage from "./pages/mypage/MyPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";

/**
 * 페이지가 하나씩 생길 때마다 여기 <Route> 를 추가합니다.
 * 아직 라우트가 없는 경로(Footer/Sidebar의 placeholder 링크 등)는 전부
 * Preview(컴포넌트 갤러리)로 빠집니다.
 *
 * // TODO(T-5): /mypage는 회원 전용이다. 지금은 비로그인 시 useMember()가 401 →
 * // axiosInstance 인터셉터가 /login 으로 보내는 동작에 맡긴다. 공용 PrivateRoute가
 * // 생기면 이 라우트를 그 안으로 옮긴다.
 */
function App() {
  const { user, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Preview />} />
      <Route
        path="/mypage"
        element={
          <>
            <Header user={user} onLogout={logout} />
            <MyPage />
            <Footer />
          </>
        }
      >
        <Route index element={<ProfileEditPage />} />
      </Route>
      <Route path="*" element={<Preview />} />
    </Routes>
  );
}

export default App;
