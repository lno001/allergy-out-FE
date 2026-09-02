import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Preview from "./preview";
import AllergyManagePage from "./pages/mypage/allergy/AllergyManagePage";
import MyPage from "./pages/mypage/MyPage";
import ProfileEditPage from "./pages/mypage/ProfileEditPage";
import RecipeCreatePage from "./pages/recipe/RecipeCreatePage";

/**
 * 라우트 정의만. 헤더/푸터는 Layout 이 전 페이지 공통으로 그린다.
 * 아직 화면이 없는 경로(Footer/사이드바 placeholder 링크 등)는 Preview(컴포넌트 갤러리)로 폴백.
 *
 * // TODO(T-5): /mypage는 회원 전용이다. 지금은 비로그인 시 MyPage 의 useMember()가 401 →
 * // 인터셉터가 /login 으로 보내는 동작에 맡긴다. 공용 PrivateRoute가 생기면 그 안으로 옮긴다.
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Preview />} />
        <Route path="/recipe" element={<RecipeCreatePage />} />
        <Route path="/mypage" element={<MyPage />}>
          <Route index element={<ProfileEditPage />} />
          <Route path="allergy" element={<AllergyManagePage />} />
        </Route>
        <Route path="*" element={<Preview />} />
      </Route>
    </Routes>
  );
}

export default App;
