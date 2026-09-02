import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Preview from "./preview";
import MyPage from "./pages/mypage/MyPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";

/**
 * 페이지가 하나씩 생길 때마다 여기 <Route> 를 추가합니다.
 * 아직 라우트가 없는 경로(Footer/Sidebar의 placeholder 링크 등)는 전부
 * Preview(컴포넌트 갤러리)로 빠집니다.
 *
 * // TODO(T-5 연동): /mypage는 회원 전용이라 PrivateRoute가 생기면 그 안으로 옮길 것.
 * // 지금 Header에 넘기는 authState="member"/userName은 로그인 기능이 없어서 mock입니다.
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Preview />} />
      <Route
        path="/mypage"
        element={
          <>
            <Header
              authState="member"
              userName="김민지"
              onLogout={() => console.log("로그아웃 (T-5 연동 전 mock)")}
            />
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
