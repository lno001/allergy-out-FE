import { Routes, Route } from "react-router-dom";

import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MyPageLayout from "./components/layout/MyPageLayout";
import AllergyManagePage from "./pages/mypage/AllergyManagePage";
import Preview from "./preview";

/**
 * 실제 페이지 라우팅이 붙기 전까지, "" 경로는 공통 컴포넌트 갤러리(preview)를 보여줍니다.
 * Header/Footer는 Preview에는 안 씌우고(컴포넌트 갤러리라 사이트 chrome이 안 어울림),
 * 실제 페이지 경로에서만 감쌉니다. 페이지가 늘어나면 이 감싸는 방식을 공통 Layout으로
 * 뽑는 걸 고려하세요(지금은 페이지가 하나라 과하게 일반화 안 함).
 *
 * /mypage/allergy는 원래 인증 필요(로그인 회원 전용) 화면이지만, PrivateRoute(T-5)가
 * 아직 없어서 지금은 가드 없이 연결만 해둠 — 로그인 안 한 상태로 들어가면 401 나고
 * axiosInstance 인터셉터가 /login으로 보냄.
 */
function App() {
  return (
    <Routes>
      <Route path="" element={<Preview />} />
      <Route
        path="/mypage/allergy"
        element={(
          <>
            <Header />
            <MyPageLayout>
              <AllergyManagePage />
            </MyPageLayout>
            <Footer />
          </>
        )}
      />
    </Routes>
  );
}

export default App;
